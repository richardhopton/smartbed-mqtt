import { Select } from '@ha/Select';
import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
import { Credentials } from '../options';
import { FanSide, FanSideCommand, sendFanControlCommand } from '../requests/sendFanControlCommand';
import { Bed } from '../types/Bed';
import { FanStatus, Snapshot } from '../types/Snapshot';

// ActiveBreeze climate control (fan cooling + heating), per side plus sync.
// State comes from snapshot.fan; commands go via processorCommand/fanControl.

const COOLING_OPTIONS = ['Off', 'Low', 'Medium', 'High'];
const SIDES: FanSide[] = ['left', 'right'];
const SIDE_NAMES: Record<FanSide, string> = { left: 'Left', right: 'Right' };
const HEAT_LEVEL = 3; // the app always uses level 3 for heat

type SideEntities = {
  cooling: Select;
  constantCool: Switch;
  heat: Switch;
};

type ClimateEntities = {
  climate?: {
    sides: Record<FanSide, SideEntities>;
    coolingSync: Select;
    heatSync: Switch;
    // Last chosen cooling mode per side; the base reports isConstant=false when the fan is off
    constantPref: Record<FanSide, boolean>;
    fan?: FanStatus;
    applyFan: (fan?: FanStatus) => void;
  };
};

const sideState = (fan: FanStatus, side: FanSide) => ({
  level: fan[`${side}Level`],
  isHeating: fan[`${side}IsHeating`],
  isConstant: fan[`${side}IsConstant`],
});

const coolingOption = ({ level, isHeating }: ReturnType<typeof sideState>) =>
  isHeating || level <= 0 ? COOLING_OPTIONS[0] : COOLING_OPTIONS[Math.min(level, 3)];

const isHeatOn = ({ level, isHeating }: ReturnType<typeof sideState>) => isHeating && level > 0;

export const processClimateEntities = async (
  mqtt: IMQTTConnection,
  bed: Bed,
  user: Credentials,
  snapshots: Snapshot[]
) => {
  const cache = bed.entities as unknown as ClimateEntities;
  const fan = snapshots.find((s) => s.fan)?.fan;
  if (!fan) {
    if (cache.climate) {
      for (const side of SIDES) {
        cache.climate.sides[side].cooling.setOffline();
        cache.climate.sides[side].constantCool.setOffline();
        cache.climate.sides[side].heat.setOffline();
      }
      cache.climate.coolingSync.setOffline();
      cache.climate.heatSync.setOffline();
    }
    return;
  }

  if (!cache.climate) {
    const { deviceData } = bed;

    const applyFan = (newFan?: FanStatus) => {
      const climate = cache.climate;
      if (!climate || !newFan) return;
      climate.fan = newFan;
      for (const side of SIDES) {
        const state = sideState(newFan, side);
        const entities = climate.sides[side];
        entities.cooling.setState(coolingOption(state));
        entities.heat.setState(isHeatOn(state));
        if (state.level > 0 && !state.isHeating) climate.constantPref[side] = state.isConstant;
        entities.constantCool.setState(climate.constantPref[side]);
      }
      const left = sideState(newFan, 'left');
      const right = sideState(newFan, 'right');
      const leftOption = coolingOption(left);
      if (leftOption === coolingOption(right)) climate.coolingSync.setState(leftOption);
      climate.heatSync.setState(isHeatOn(left) && isHeatOn(right));
    };

    const send = async (sides: Partial<Record<FanSide, FanSideCommand>>) => {
      const results = await sendFanControlCommand(sides, user);
      applyFan(results.find((s) => s.fan)?.fan);
    };

    const coolingCommand = (side: FanSide, option: string): FanSideCommand => {
      const level = COOLING_OPTIONS.indexOf(option);
      return { level, isHeating: false, isConstant: level > 0 && cache.climate!.constantPref[side] };
    };

    const heatCommand = (on: boolean): FanSideCommand => ({
      level: on ? HEAT_LEVEL : 0,
      isHeating: true,
      isConstant: false,
    });

    const buildSide = (side: FanSide): SideEntities => {
      const sideName = SIDE_NAMES[side];
      return {
        cooling: new Select(
          mqtt,
          deviceData,
          { ...buildEntityConfig('Cooling', sideName), options: COOLING_OPTIONS, icon: 'mdi:fan' },
          async (option) => {
            await send({ [side]: coolingCommand(side, option) });
            return cache.climate!.sides[side].cooling.getState();
          }
        ),
        constantCool: new Switch(
          mqtt,
          deviceData,
          { ...buildEntityConfig('Constant Cool', sideName), category: 'config', icon: 'mdi:snowflake' },
          async (constant) => {
            const climate = cache.climate!;
            climate.constantPref[side] = constant;
            const current = climate.fan && sideState(climate.fan, side);
            if (current && current.level > 0 && !current.isHeating) {
              await send({ [side]: { level: current.level, isHeating: false, isConstant: constant } });
            }
            return climate.constantPref[side];
          }
        ),
        heat: new Switch(
          mqtt,
          deviceData,
          { ...buildEntityConfig('Heat', sideName), icon: 'mdi:heat-wave' },
          async (on) => {
            await send({ [side]: heatCommand(on) });
            return cache.climate!.sides[side].heat.getState();
          }
        ),
      };
    };

    cache.climate = {
      sides: { left: buildSide('left'), right: buildSide('right') },
      constantPref: { left: fan.leftIsConstant, right: fan.rightIsConstant },
      coolingSync: new Select(
        mqtt,
        deviceData,
        { ...buildEntityConfig('Cooling', 'Sync'), options: COOLING_OPTIONS, icon: 'mdi:fan' },
        async (option) => {
          await send({ left: coolingCommand('left', option), right: coolingCommand('right', option) });
          return cache.climate!.coolingSync.getState();
        }
      ),
      heatSync: new Switch(
        mqtt,
        deviceData,
        { ...buildEntityConfig('Heat', 'Sync'), icon: 'mdi:heat-wave' },
        async (on) => {
          await send({ left: heatCommand(on), right: heatCommand(on) });
          return cache.climate!.heatSync.getState();
        }
      ),
      applyFan,
    };
  }

  const climate = cache.climate;
  climate.applyFan(fan);
  // Entity state is published without the retain flag, so re-assert availability and
  // state every cycle; otherwise an HA or broker restart leaves these unavailable.
  for (const side of SIDES) {
    const entities = climate.sides[side];
    entities.cooling.republish();
    entities.constantCool.republish();
    entities.heat.republish();
  }
  climate.coolingSync.republish();
  climate.heatSync.republish();
};

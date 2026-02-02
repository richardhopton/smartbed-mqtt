import { Select } from '@ha/Select';
import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
import { sendFanCommand } from '../requests/sendFanCommand';
import { sendAdjustableBaseCommand } from '../requests/sendAdjustableBaseCommand';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';
import { Controller } from '../types/Controller';
import { FanState, Snapshot } from '../types/Snapshot';

const FAN_SPEED_OPTIONS = ['Off', 'Low', 'Medium', 'High'];

interface FanEntitiesCache {
  fanSpeed?: Select;
  fanHeating?: Switch;
}

const getSideState = (fan: FanState, side: 0 | 1) => {
  if (side === 0) {
    return {
      level: fan.leftLevel,
      isHeating: fan.leftIsHeating,
      isConstant: fan.leftIsConstant,
      timer: fan.leftTimer,
    };
  }
  return {
    level: fan.rightLevel,
    isHeating: fan.rightIsHeating,
    isConstant: fan.rightIsConstant,
    timer: fan.rightTimer,
  };
};

const getSideKey = (side: 0 | 1): 'left' | 'right' => (side === 0 ? 'left' : 'right');

export const processFanEntities = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { sideName, entities, user, side }: Controller,
  snapshot: Snapshot
) => {
  const fan = snapshot.fan;
  if (!fan) return;

  const cache = entities as FanEntitiesCache;
  const sideKey = getSideKey(side);
  const sideState = getSideState(fan, side);

  // Fan Speed Select (Off / Low / Medium / High)
  if (!cache.fanSpeed) {
    cache.fanSpeed = new Select(
      mqtt,
      deviceData,
      {
        options: FAN_SPEED_OPTIONS,
        icon: 'mdi:fan',
        ...buildEntityConfig('Fan Speed', sideName),
      },
      async (state: string) => {
        const level = FAN_SPEED_OPTIONS.indexOf(state);
        await sendFanCommand(
          sideKey,
          {
            level,
            isHeating: sideState.isHeating,
            isConstant: sideState.isConstant,
          },
          user
        );
        // Refresh state after command
        const results = await sendAdjustableBaseCommand(Commands.Status, user);
        const updated = results.find((r) => r.side === side);
        if (updated?.fan) {
          const newState = getSideState(updated.fan, side);
          sideState.level = newState.level;
          sideState.isHeating = newState.isHeating;
          sideState.isConstant = newState.isConstant;
          sideState.timer = newState.timer;
          cache.fanHeating?.setState(newState.isHeating);
        }
        return FAN_SPEED_OPTIONS[level];
      }
    ).setOnline();
  }
  cache.fanSpeed.setState(FAN_SPEED_OPTIONS[sideState.level] || 'Off');

  // Fan Heating/Cooling Mode Switch
  if (!cache.fanHeating) {
    cache.fanHeating = new Switch(
      mqtt,
      deviceData,
      {
        icon: 'mdi:heat-wave',
        ...buildEntityConfig('Fan Heating', sideName),
      },
      async (state: boolean) => {
        if (sideState.level === 0) return state; // No-op if fan is off
        await sendFanCommand(
          sideKey,
          {
            level: sideState.level,
            isHeating: state,
            isConstant: sideState.isConstant,
          },
          user
        );
        // Refresh state
        const results = await sendAdjustableBaseCommand(Commands.Status, user);
        const updated = results.find((r) => r.side === side);
        if (updated?.fan) {
          const newState = getSideState(updated.fan, side);
          sideState.level = newState.level;
          sideState.isHeating = newState.isHeating;
          sideState.isConstant = newState.isConstant;
          sideState.timer = newState.timer;
          cache.fanSpeed?.setState(FAN_SPEED_OPTIONS[newState.level] || 'Off');
        }
        return state;
      }
    ).setOnline();
  }
  cache.fanHeating.setState(sideState.isHeating);
};

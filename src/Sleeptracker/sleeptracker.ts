import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityName } from '@utils/buildEntityName';
import { Dictionary } from '@utils/Dictionary';
import { getSideNameFunc } from '@utils/getSideNameFunc';
import { logError, logInfo } from '@utils/logger';
import { getSleeptrackerRefreshFrequency, getSleeptrackerUsers } from '@utils/Options';
import { buildMQTTDeviceData } from './buildMQTTDeviceData';
import { DeviceInfoSensor } from './entities/DeviceInfoSensor';
import { HelloDataSensor } from './entities/InfoSensor';
import { SleepSensorInfoSensor } from './entities/SensorMapInfoSensor';
import { processBedPositionSensors } from './processors/bedPositionSensors';
import { processEnvironmentSensors } from './processors/environmentSensors';
import { setupMassageButtons } from './processors/massageButtons';
import { processMassageSensors } from './processors/massageSensors';
import { setupPresetButtons } from './processors/presetButtons';
import { processSafetyLightSwitches } from './processors/safetyLightSwitches';
import { processSnoreReliefSwitches } from './processors/snoreReliefSwitches';
import { getDevices } from './requests/getDevices';
import { getHelloData } from './requests/getHelloData';
import { getSleepSensors } from './requests/getSleepSensors';
import { sendAdjustableBaseCommand } from './requests/sendAdjustableBaseCommand';
import { Bed } from './types/Bed';
import { Commands } from './types/Commands';

const minutes = (numMinutes: number) => numMinutes * seconds(60);
const seconds = (numSeconds: number) => numSeconds * 1000;

const beds: Dictionary<Bed> = {};

export const sleeptracker = async (mqtt: IMQTTConnection) => {
  const users = getSleeptrackerUsers();

  for (const user of users) {
    const devices = await getDevices(user);
    if (!devices || devices.length === 0) {
      return logError('Could not load devices');
    }
    for (const device of devices) {
      const { deviceID: deviceId, sleeptrackerProcessorID: processorId } = device;
      let bed = beds[deviceId];

      const helloData = await getHelloData(processorId, user);
      if (!helloData) {
        logError('Could not load helloData');
        continue;
      }

      if (!bed) {
        const {
          baseSmartCableSupported: isSmartBed,
          powerBase: { antiSnorePresetSupported, headAngleTicksPerDegree, footAngleTicksPerDegree },
        } = device;
        const deviceData = buildMQTTDeviceData(device);
        bed = beds[deviceId] = {
          deviceId,
          processorId,
          deviceData,
          primaryUser: user,
          sides: [],
          sensors: [],
          supportedFeatures: {
            smartBedControls: isSmartBed,
            antiSnorePreset: antiSnorePresetSupported,
            environmentSensors: helloData.productFeatures.includes('env_sensors'),
          },
          data: { headAngleTicksPerDegree, footAngleTicksPerDegree },
          entities: {
            deviceInfo: new DeviceInfoSensor(mqtt, deviceData).setState(device),
            helloData: new HelloDataSensor(mqtt, deviceData).setState(helloData),
          },
        };
      }
      const capabilities = helloData.motorMeta.capabilities;
      const sleepSensors = await getSleepSensors(bed.processorId, user);
      const sideNameFunc = getSideNameFunc(sleepSensors, (s) => s.unitNumber);
      for (const sleepSensor of sleepSensors) {
        const { unitNumber: side } = sleepSensor;
        bed.sensors[side] = sleepSensor;

        const sideName = sideNameFunc(sleepSensor);
        const entityKey = `sleepSensor.${sideName}`;
        let sleepSensorInfo = bed.entities[entityKey] as SleepSensorInfoSensor;
        if (!sleepSensorInfo) {
          sleepSensorInfo = bed.entities[entityKey] = new SleepSensorInfoSensor(
            mqtt,
            bed.deviceData,
            buildEntityName('Sleep Sensor', sideName)
          )
            .setState(sleepSensor)
            .setOnline();
        }
        if (sleepSensor.self) {
          sleepSensorInfo.setState(sleepSensor);
          const capability =
            capabilities.length === 1 ? capabilities[0] : capabilities.find((c) => c.side === sleepSensor.unitNumber);
          const sideNameFunc = getSideNameFunc(capabilities, (c) => c.side);
          if (!capability || bed.sides.find((s) => s.side === capability.side)) continue;

          bed.sides.push({ user, side: capability.side, sideName: sideNameFunc(capability), capability, entities: {} });
        }
      }
    }
  }

  const refreshDeviceData = async () => {
    for (const bed of Object.values(beds)) {
      logInfo('Fetching data for bed', bed.deviceId);
      const { smartBedControls, environmentSensors } = bed.supportedFeatures;
      if (smartBedControls) {
        for (const side of bed.sides) {
          await setupPresetButtons(mqtt, bed, side);
          await setupMassageButtons(mqtt, bed, side);

          await processSnoreReliefSwitches(mqtt, bed, side);

          const snapshots = await sendAdjustableBaseCommand(Commands.Status, side.user);
          const snapshot = snapshots.find((s) => s.side === side.side);
          if (!snapshot) continue;

          await processBedPositionSensors(mqtt, bed, side, snapshot);
          await processMassageSensors(mqtt, bed, side, snapshot);

          await processSafetyLightSwitches(mqtt, bed, side, snapshot);
        }
      }
      if (environmentSensors) {
        await processEnvironmentSensors(mqtt, bed);
      }
    }
  };
  await refreshDeviceData();
  setInterval(refreshDeviceData, minutes(getSleeptrackerRefreshFrequency()));
};

import { IStateful } from '@ha/base/IStateful';

export type AlarmSchedule = { alarmBedVibrationEnabledFlag: boolean; alarmPhoneAudioEnabledFlag: boolean };

export class AlarmScheduleEntitySet implements IStateful<AlarmSchedule> {
  setState(state: AlarmSchedule | null): void {
    state;
    throw new Error('Method not implemented.');
  }
  getState(): AlarmSchedule | undefined {
    throw new Error('Method not implemented.');
  }
}

/*
 "alarmScheduleList": [{
    "alarmBedVibrationEnabledFlag": true,
    "alarmLabel": "Default Alarm",
    "alarmID": 1,
    "sound": "Alarm External Selection",
    "alarmWindowMin": 0,
    "alarmPhoneAudioEnabledFlag": false,
    "alarmTimeMinPastMidnight": 1320,
    "enabled": true,
    "action": 1,
    "repeatDays": 85,
    "volume": 11
}]
 */

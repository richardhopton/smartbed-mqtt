export type MassageStatus = {
  active: boolean;
  strength: number;
};

export type MotorStatus = {
  pulseCount: number;
};

type MassageMotorStatus = {
  massage: MassageStatus;
  motor: MotorStatus;
};

export enum MassagePattern {
  None = 0,
  Pulse = 1,
  Constant = 2,
  Ripple = 3,
}

export type FanState = {
  leftIsConstant: boolean;
  leftIsHeating: boolean;
  leftLevel: number;
  leftTimer: number;
  rightIsConstant: boolean;
  rightIsHeating: boolean;
  rightLevel: number;
  rightTimer: number;
};

export type Snapshot = {
  cableTime: number;
  foot: MassageMotorStatus;
  head: MassageMotorStatus;
  headTilt: MassageMotorStatus;
  lumbar: MassageMotorStatus;
  massagePattern: MassagePattern;
  massageTimerMins: number;
  massageTimerSecs: number;
  safetyLightOn: boolean;
  side: 0 | 1;
  fan?: FanState;
};
/*
    "timeIsSet": true,
    "timeLastActuatorMovement": 1676790911,
    "timeLastMassageActive": 1676791742
*/

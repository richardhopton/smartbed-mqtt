export type MassageStatus = {
  amplitude: number;
};

export type MotorStatus = {
  isMoving: boolean;
  pulseCount: number;
  status: string;
  targetPulseCount: number;
  timeSinceLastStop: number;
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
  Wave = 4,
}

export type FanStatus = {
  leftLevel: number;
  leftTimer: number;
  leftIsHeating: boolean;
  leftIsConstant: boolean;
  rightLevel: number;
  rightTimer: number;
  rightIsHeating: boolean;
  rightIsConstant: boolean;
};

export type Snapshot = {
  cableTime: number;
  fan?: FanStatus;
  splitFan?: number;
  foot: MassageMotorStatus;
  head: MassageMotorStatus;
  headTilt: MassageMotorStatus;
  lumbar: MassageMotorStatus;
  massagePattern: MassagePattern;
  massageTimerMins: number;
  massageTimerSecs: number;
  safetyLightOn: boolean;
  side: 0 | 1;
};

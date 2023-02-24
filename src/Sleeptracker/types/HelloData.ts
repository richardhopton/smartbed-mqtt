export type Capability = {
  controllerModel: string;
  controllerVersion: number;
  massageRoster: {
    foot: boolean;
    head: boolean;
    headTilt: boolean;
    lumber: boolean;
  };
  memSlotCount: number;
  motorRoster: {
    foot: boolean;
    head: boolean;
    headTilt: boolean;
    lumber: boolean;
  };
  side: 0 | 1;
};

type Sensor = {
  description: string;
  firmwareVersion: string;
  hardwareVersion: string;
  location: string;
  locationCode: number;
  model: string;
  serial: string;
  status: string;
  tag: string;
  unit: number;
};

export type HelloData = {
  FSOS: string;
  FSPRevision: string;
  FSPVersion: string;
  Hardware: string;
  LuBoot: {
    globalBootCount: number;
    rebootReason: string;
    version: string;
  };
  NetworkConnectivity: boolean;
  RAPVersion: number;
  SKUSensorCount: number;
  Serial: string;
  ServerConnectivity: boolean;
  SleepTrackerOS: string;
  SystemType: string;
  canonicalVersion: string;
  gmtLastGoodSleepUpload: number;
  gmtOffset: number;
  gmtTimeNow: number;
  leftSensor: {
    status: string;
  };
  localTimeNow: number;
  macAddress: string;
  mfgDate: string;
  mfgSerial: string;
  motorMeta: {
    boardFirmwareVersion: number;
    boardFirmwareVersionString: string;
    boardHardwareVersion: number;
    boardSerialNumber: string;
    capabilities: Capability[];
    connectionStatus: string;
    smartCableUnsynchronized: boolean;
  };
  product: string;
  productFeatures: string[];
  productModel: string;
  rightSensor: {
    status: string;
  };
  sensors: Sensor[];
  timeValid: boolean;
  uptime: {
    secsSinceStartup: number;
    string: string;
    timeFirstPowerOnGmt: number;
    timeFirstPowerOnGmtString: string;
    timeThisPowerOnGmt: number;
    timeThisPowerOnGmtString: string;
  };
  wifi: {
    RSSI: number;
    SSIDBase64: string;
    country_code: string;
    macOfRemoteAp: string;
    signalGood: boolean;
    signalStrength: number;
  };
};

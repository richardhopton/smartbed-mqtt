export type Capability = {
  controllerModel: string;
  controllerVersion: number;
  massageRoster: {
    foot: boolean;
    head: boolean;
    headTilt: boolean;
    lumber?: boolean;
    lumbar?: boolean;
  };
  memSlotCount: number;
  motorRoster: {
    foot: boolean;
    head: boolean;
    headTilt: boolean;
    lumber?: boolean;
    lumbar?: boolean;
  };
  side: 0 | 1;
};

export type HelloData = {
  motorMeta: {
    capabilities: Capability[];
  };
  productFeatures: ('env_sensors' | 'motors' | 'fan_controller' | string)[];
};

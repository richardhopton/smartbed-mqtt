import { Dictionary } from '@utils/Dictionary';
import { Remote } from './Remote';

export const supportedRemotes: Dictionary<Remote> = {
  '80608': {
    name: 'RFS ELLIPSE',
    commands: {
      Flat: 0x100000aa,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      UBL: 0x20000,
    },
  },
  '94238': {
    name: 'RF FLASHLINE',
    commands: {
      Flat: 0x10000000,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      Memory1: 0x1000,
      Memory2: 0x2000,
      MemorySave: {
        data: 0x10000,
        waitTime: 200,
        count: 25,
      },
      UBL: {
        data: 0x20000,
        waitTime: 100,
        count: 50,
      },
    },
  },
  '88875': {
    name: 'RF LITELINE',
    commands: {
      Flat: 0x100000aa,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      UBL: 0x20000,
    },
  },
  '82417': {
    name: 'RF TOPLINE',
    commands: {
      Flat: 0x000000aa,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      UBL: 0x20000,
    },
  },
  '82418': {
    name: 'RF TOPLINE',
    commands: {
      Flat: 0x000000aa,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      Memory1: 0x1000,
      Memory2: 0x2000,
      MemorySave: {
        data: 0x10000,
        count: 10,
        waitTime: 200,
      },
      UBL: 0x20000,
    },
  },
  '91244': {
    name: 'RF-FLASHLINE',
    commands: {
      Flat: 0x100000aa,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      UBL: 0x20000,
    },
  },
  '93329': {
    name: 'RF TOPLINE',
    commands: {
      Flat: 0x0000002a,
      HeadDown: 0x20,
      HeadUp: 0x10,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      Memory1: 0x1000,
      Memory2: 0x2000,
      Memory3: 0x4000,
      Memory4: 0x8000,
      MemorySave: {
        data: 0x10000,
        count: 10,
        waitTime: 200,
      },
      UBL: {
        data: 0x20000,
        count: 50,
        waitTime: 100,
      },
    },
  },
  '93332': {
    name: 'RF TOPLINE',
    commands: {
      Flat: 0x000000aa,
      HeadDown: 0x20,
      HeadUp: 0x10,
      BackDown: 0x2,
      BackUp: 0x1,
      LegsDown: 0x8,
      LegsUp: 0x4,
      FeetDown: 0x20,
      FeetUp: 0x40,
      Memory1: 0x1000,
      Memory2: 0x2000,
      MemorySave: {
        data: 0x10000,
        count: 10,
        waitTime: 200,
      },
      UBL: {
        data: 0x20000,
        count: 50,
        waitTime: 100,
      },
    },
  },
};

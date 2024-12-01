import { StringsKey } from '@utils/getString';

type CommandOptions = {
  repeat?: boolean;
  category?: string;
};
export const buildCommands = (name: string) => {
  const buildCommand = (name: StringsKey, commandCode: string, { repeat, category }: CommandOptions = {}) => ({
    name,
    command: [0x24, commandCode.charCodeAt(0)],
    repeat,
    category,
  });
  const [remoteType, motorNumber] = name.substring(8, 10).split('');
  const commands = [
    // buildCommand('HeadUp', 'K', { repeat: true }),
    // buildCommand('HeadDown', 'L', { repeat: true }),
    buildCommand('PresetHome', 'O'),
  ];
  // if (!(motorNumber === '1' || (remoteType === '5' && motorNumber !== '5'))) {
  //   commands.push(buildCommand('FootUp', 'M', { repeat: true }), buildCommand('FootDown', 'N', { repeat: true }));
  // }
  if (
    (['1', '2', '4', '5', '6', '7'].includes(remoteType) && motorNumber === '5') ||
    ['B', 'C', '7', '8', '0'].includes(remoteType) ||
    (['3', '4'].includes(remoteType) && ['1', '2', '3', '4'].includes(motorNumber)) ||
    (remoteType === '9' && ['5', '6', '7', '8'].includes(motorNumber))
  ) {
    commands.push(
      buildCommand('PresetMemory1', 'U'),
      buildCommand('ProgramMemory1', 'Z', { category: 'config' }),
      buildCommand('PresetMemory2', 'V'),
      buildCommand('ProgramMemory2', 'a', { category: 'config' })
    );

    if (!['7', '8', '9', '0'].includes(remoteType)) {
      commands.push(
        buildCommand('PresetAntiSnore', 'R'),
        buildCommand('ProgramAntiSnore', 'W', { category: 'config' }),
        buildCommand('PresetTV', 'S'),
        buildCommand('ProgramTV', 'X', { category: 'config' }),
        buildCommand('PresetZeroG', 'T'),
        buildCommand('ProgramZeroG', 'Y', { category: 'config' })
      );
    }
  }
  if (['8', '9'].includes(remoteType) && ['2', '5', '6', '7', '8'].includes(motorNumber)) {
    commands.push(
      buildCommand('PresetAntiSnore', 'R'),
      buildCommand('PresetTV', 'S'),
      buildCommand('PresetZeroG', 'T')
    );
  }
  if (
    (['3', '4', '8'].includes(remoteType) && ['3', '5'].includes(motorNumber)) ||
    ['A', 'B'].includes(remoteType) ||
    (remoteType === '7' && motorNumber !== '5') ||
    (remoteType === '9' && ['5', '6', '7', '8'].includes(motorNumber))
  ) {
    commands.push(
      buildCommand('MassageHeadStep', 'C'),
      buildCommand('MassageFootStep', 'B'),
      buildCommand('Stop', 'D')
    );
  }
  if ((remoteType === '4' && ['3', '5'].includes(motorNumber)) || remoteType === '0') {
    commands.push(buildCommand('MassageHeadOff', 'J'), buildCommand('MassageFootOff', 'I'));
  }

  if (
    !(['5', '6'].includes(remoteType) && motorNumber !== '5') &&
    !(remoteType === '9' && !['5', '6', '7', '8'].includes(motorNumber)) &&
    remoteType !== '0'
  ) {
    commands.push(buildCommand('UnderBedLightsToggle', 'A'));
  }

  // if (
  //   (['3', '4'].includes(remoteType) && ['3', '4'].includes(motorNumber)) ||
  //   (['5', '7'].includes(remoteType) && motorNumber === '5') ||
  //   (remoteType === '9' && motorNumber === '7')
  // ) {
  //   commands.push(buildCommand('NeckUp', 'P', { repeat: true }), buildCommand('NeckDown', 'Q', { repeat: true }));
  // }
  // if (
  //   (['1', '2', '3', '4', '6', '8'].includes(remoteType) && motorNumber === '5') ||
  //   ['A', 'B', 'C'].includes(remoteType)
  // ) {
  //   commands.push(buildCommand('LumbarUp', 'P', { repeat: true }), buildCommand('LumbarDown', 'Q', { repeat: true }));
  // }
  // if (
  //   (['3', '4'].includes(remoteType) && motorNumber === '4') ||
  //   (remoteType === '7' && motorNumber === '5') ||
  //   (remoteType === '9' && ['7', '8'].includes(motorNumber))
  // ) {
  //   commands.push(buildCommand('LumbarUp', 'p', { repeat: true }), buildCommand('LumbarDown', 'q', { repeat: true }));
  // }
  // if (remoteType === '5' && motorNumber === '5') {
  //   commands.push(buildCommand('TiltUp', 'p', { repeat: true }), buildCommand('TiltDown', 'q', { repeat: true }));
  // }
  // if (remoteType === '0' || (remoteType === '9' && motorNumber === '5')) {
  //   commands.push(buildCommand('TiltUp', 'P', { repeat: true }), buildCommand('TiltDown', 'Q', { repeat: true }));
  // }
  if (remoteType === '0') {
    commands.push(
      // buildCommand('AllUp', 'p', { repeat: true }),
      // buildCommand('AllDown', 'q', { repeat: true }),
      buildCommand('MassageHeadUp', 'G'),
      buildCommand('MassageHeadDown', 'H'),
      buildCommand('MassageFootUp', 'E'),
      buildCommand('MassageFootDown', 'F')
    );
  }

  return commands;
};

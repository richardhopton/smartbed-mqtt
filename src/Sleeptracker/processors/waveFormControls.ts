import { Select } from '@ha/Select';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
import { sendAdjustableBaseCommand } from '../requests/sendAdjustableBaseCommand';
import { sendMotorAnimationCommand } from '../requests/sendMotorAnimationCommand';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';
import { Controller } from '../types/Controller';

// Wave Form™ massage options, reverse-engineered from the Tempur/Sleeptracker app.
// The app sends a "frequency" statement (the raw value below) plus a "pulse"
// statement whose value is a per-frequency mapping. Names match the app's own
// therapeutic labels for each frequency.
const WAVE_FORMS: { name: string; frequency: number; pulse: number }[] = [
  { name: '28Hz Sleeplessness', frequency: 28, pulse: 4 },
  { name: '40Hz Mood', frequency: 40, pulse: 5 },
  { name: '52Hz Back Pain', frequency: 52, pulse: 3 }, // app default
  { name: '68Hz Neck Pain', frequency: 68, pulse: 2 },
  { name: '88Hz Headache', frequency: 88, pulse: 1 },
];
const OFF = 'Off';
const DEFAULT_DURATION = '105'; // app maximum; matches the app's duration picker (5..105 by 5)
const DURATION_OPTIONS = Array.from({ length: 21 }, (_, i) => `${(i + 1) * 5}`); // 5..105

interface WaveFormEntities {
  waveFormDuration?: Select;
  waveForm?: Select;
}

const buildWaveFormStatements = (side: 0 | 1, frequency: number, pulse: number, durationMinutes: number) => [
  {
    type: 'command',
    startDelayMs: 0,
    command: {
      massage: {
        position: { side, location: 'ignore_this' }, // literal value the app sends for this field
        action: 'pulse',
        value: pulse,
        duration: durationMinutes * 600,
      },
    },
  },
  {
    type: 'command',
    startDelayMs: 500,
    command: {
      massage: {
        position: { side },
        action: 'frequency',
        value: frequency,
      },
    },
  },
];

export const setupWaveFormControls = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { sideName, side, user, entities, capability: { massageRoster } }: Controller
) => {
  const cache = entities as WaveFormEntities;
  if (!(massageRoster.head || massageRoster.foot)) {
    cache.waveForm?.setOffline();
    cache.waveFormDuration?.setOffline();
    return;
  }

  if (!cache.waveFormDuration) {
    cache.waveFormDuration = new Select(
      mqtt,
      deviceData,
      { ...buildEntityConfig('Wave Form Duration (min)', sideName), options: DURATION_OPTIONS },
      async () => undefined
    );
    cache.waveFormDuration.setState(DEFAULT_DURATION);
  }
  cache.waveFormDuration.resendState();
  cache.waveFormDuration.setOnline();

  if (!cache.waveForm) {
    cache.waveForm = new Select(
      mqtt,
      deviceData,
      { ...buildEntityConfig('Wave Form', sideName), options: [OFF, ...WAVE_FORMS.map((w) => w.name)] },
      async (selection) => {
        if (selection === OFF) {
          await sendAdjustableBaseCommand(Commands.MassageStop, user, { massageAdjustment: 0, requestStatus: true });
          return OFF;
        }
        const wave = WAVE_FORMS.find((w) => w.name === selection);
        if (!wave) return OFF;
        const durationMinutes =
          parseInt(cache.waveFormDuration?.getState() || DEFAULT_DURATION, 10) || parseInt(DEFAULT_DURATION, 10);
        await sendMotorAnimationCommand(buildWaveFormStatements(side, wave.frequency, wave.pulse, durationMinutes), user);
        return selection;
      }
    );
    cache.waveForm.setState(OFF);
  }
  cache.waveForm.resendState();
  cache.waveForm.setOnline();
};

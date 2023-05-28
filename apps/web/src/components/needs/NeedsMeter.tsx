import * as React from 'react';

import MeterEmpty from '~/assets/ui/meter/empty.png';
import MeterFull from '~/assets/ui/meter/full.png';
import { useEnergyStore } from '~/game/entities/pets/sleep-behaviour.ts/SleepBehaviour';

interface Props {
  game: Phaser.Game;
}

export function NeedsMeter({ game }: Props) {
  const energy = useEnergyStore();

  return (
    <div>
      <div className="pointer-events-none fixed bottom-5 left-7 z-20 text-2xl tracking-wide text-white/70">
        energy
      </div>

      <img src={MeterEmpty} className="pointer-events-none fixed bottom-4 left-4 z-10 h-9 w-32" />

      <div className="fixed bottom-4 left-4 z-10 w-32">
        <div
          className={'pointer-events-none h-9 w-full bg-cover bg-center'}
          style={{ background: `url(${MeterFull})`, width: `${energy.value}%` }}
        />
      </div>
    </div>
  );
}

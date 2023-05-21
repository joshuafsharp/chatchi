import { Player } from '~/game/entities';
import { CatPrefab } from '~/game/entities/pets/cat/CatPrefab';

export const characterIds = [Player.id, CatPrefab.id] as const;

export type CharacterId = (typeof characterIds)[number];

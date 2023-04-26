
import { Direction as GridEngineDirection } from 'grid-engine'

export type InvalidDirection = Exclude<GridEngineDirection, GridEngineDirection.UP | GridEngineDirection.RIGHT | GridEngineDirection.DOWN | GridEngineDirection.LEFT>
export type ValidDirection = Exclude<GridEngineDirection, InvalidDirection>

export type TileType = "walkable" | "wall"

export type Surroundings = {
    [direction in ValidDirection]: TileType
}
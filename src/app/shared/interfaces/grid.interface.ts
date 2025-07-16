import { DifficultyType } from "../types/difficulty.type";

export interface GridInterface {
  value: Array<Array<number>>;
  default: Array<Array<number>>;
  solution: Array<Array<number>>;
  difficulty: DifficultyType;
}

import { GridInterface } from "./grid.interface";

export interface NewboardInterface {
  grids: Array<GridInterface>;
  results: number;
  message: string;
}

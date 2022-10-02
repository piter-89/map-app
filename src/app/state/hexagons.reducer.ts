import { createReducer, on } from "@ngrx/store";
import { addHexagons, removeHexagons } from './hexagons.actions';

export const initialState: ReadonlyArray<any> = [];

export const hexagonsReducer = createReducer(
  initialState,
  on(removeHexagons, () => []),
  on(addHexagons, (state, { hexagons }) => {
    return hexagons;
  })
);
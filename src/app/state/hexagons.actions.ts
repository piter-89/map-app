import { createAction, props } from "@ngrx/store";

export const addHexagons = createAction (
  '[Map Page] Add Hexagons',
  props<{ hexagons: any }>()
)

export const removeHexagons = createAction (
  '[Map Page] Remove Hexagons'
)
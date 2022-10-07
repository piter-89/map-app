import { createAction, props } from '@ngrx/store';
import { Hexagon } from '../shared/types/map';

export const addHexagons = createAction(
  '[Map Page] Add Hexagons',
  props<{ hexagons: Array<Hexagon> }>()
);

export const removeHexagons = createAction('[Map Page] Remove Hexagons');

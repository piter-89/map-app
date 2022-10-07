import { createAction, props } from "@ngrx/store";
import { Poi } from "../shared/types/map";

export const addLayer = createAction(
  '[Map Page] Add Layer',
  props<{ layer: any }>()
)

export const removeLayers = createAction(
  '[Map Page] Remove all layers'
)

export const addPOIs = createAction(
  '[Map Page] Add POIs',
  props<{ POIs: Array<Poi> }>()
)

export const removePOIs = createAction(
  '[Map Page] Remove POIs'
)
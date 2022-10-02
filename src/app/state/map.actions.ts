import { createAction, props } from "@ngrx/store";

export const addLayer = createAction(
  '[Map Page] Add Layer',
  props<{ layer: any }>()
)

export const removeLayers = createAction(
  '[Map Page] Remove all layers'
)

export const addPOIs = createAction(
  '[Map Page] Add POIs',
  props<{ POIs: any }>()
)

export const removePOIs = createAction(
  '[Map Page] Remove POIs'
)
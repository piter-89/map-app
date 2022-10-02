import { createReducer, on } from "@ngrx/store";
import { addLayer, removeLayers, addPOIs, removePOIs } from "./map.actions";

export const initialLayersState: ReadonlyArray<any> = [];
export const initialPOIsState: ReadonlyArray<any> = [];

export const layersReducer = createReducer(
  initialLayersState,
  on(removeLayers, (state) => {
    state.forEach(layer => {
      if(layer.remove) {
        layer.remove();
      }
    });
    return [];
  }),
  on(addLayer, (state, { layer }) => {
    console.log('HERE LAYERS')
    return [...state, layer];
  })
);

export const poisReducer = createReducer(
  initialPOIsState,
  on(removePOIs, () => []),
  on(addPOIs, (state, { POIs }) => {
    return POIs;
  })
)
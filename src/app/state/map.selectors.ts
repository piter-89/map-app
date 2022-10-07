import { createFeatureSelector } from "@ngrx/store";
import { Poi } from "../shared/types/map";

export const selectLayers = createFeatureSelector('layers');
export const selectPOIs = createFeatureSelector<Array<Poi>>('POIs');
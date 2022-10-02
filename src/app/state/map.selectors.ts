import { createFeatureSelector } from "@ngrx/store";

export const selectLayers = createFeatureSelector('layers');
export const selectPOIs = createFeatureSelector('POIs');
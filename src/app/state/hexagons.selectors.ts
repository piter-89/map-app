import { createSelector, createFeatureSelector } from "@ngrx/store";
import { Hexagon } from "../shared/types/map";

export const selectHexagons = createFeatureSelector<Array<Hexagon>>('hexagons');
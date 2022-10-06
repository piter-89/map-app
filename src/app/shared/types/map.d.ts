export type MapBoundries = {
  _northEast: Coordinates,
  _northWest: Coordinates,
  _southEast: Coordinates,
  _southWest: Coordinates
}

export type Coordinates = {
  lat: number,
  lng: number
}

export type Poi = {
  coordinates: Array<number>, //lat, lon, alt
  country: string,
  geom: string, // PostGIS geospatial string defining coordinates of lat, lon, alt,
  geom2: string, // PostGIS geospatial string defining coordinates of just lat and lon
  id: string, // GUID
  osm_id: string, // ID comming from Open Street Maps
  type: string // type of figure in Open Street Maps
}
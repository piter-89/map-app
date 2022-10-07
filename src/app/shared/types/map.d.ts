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

export type Hexagon = {
  center: string,
  centertxt: Coordinates,
  hex_index: string, // H3 library internal hexagon index
  hexagon: string, // PostGIS geospatial string defining nodes of polygon,
  id: string, // GUID
  nodes: Array<Coordinates>, // nodes of polygon in lat lon decimal format
  pois_count: number
  resolution: number
}

export type PoisTag = {
  name: string,
  value: string
}
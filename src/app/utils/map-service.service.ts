import { ElementRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Hexagon, MapBoundries, Poi, PoisTag } from '../shared/types/map';
import { Filters } from '../shared/types/filtration';

@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  constructor(private http: HttpClient) {}

  postData(url: string, data): any {
    return lastValueFrom(this.http.post(url, data));
  }

  getData(url: string): any {
    return lastValueFrom(this.http.get(url));
  }

  async getHexagons(
    resolution: number,
    diagonalBoxPX: number,
    mapBounds: MapBoundries,
    filtrationData: Filters
  ): Promise<Array<Hexagon>> {
    const hexagons: Array<Hexagon> = await this.postData(
      'http://localhost:3010/hexagons',
      {
        resolution,
        diagonalBoxPX,
        mapBounds,
        filtrationData,
      }
    );

    return hexagons;
  }

  async getPOIsByHexagon(
    hexIndex: string,
    filtrationData: Filters
  ): Promise<Array<Poi>> {
    const POIs: Array<Poi> = await this.postData('http://localhost:3010/poi', {
      hexIndex,
      filtrationData,
    });

    return POIs;
  }

  async getPOIsTags(poiId: string): Promise<Array<PoisTag>> {
    const poisTags: Array<PoisTag> = await this.getData(
      `http://localhost:3010/tags/${poiId}`
    );

    return poisTags;
  }

  async getPOIs(
    diagonalBoxPX: number,
    mapBounds: MapBoundries,
    filtrationData: Filters
  ): Promise<Array<Poi>> {
    const POIS: Array<Poi> = await this.postData('http://localhost:3010/pois', {
      diagonalBoxPX,
      mapBounds,
      filtrationData,
    });

    return POIS;
  }

  getMapParams(mapContainer: ElementRef, zoomCurrent: number, MAP: L.Map) {
    console.log('getMapParams');
    return {
      diagonalBoxPX: this.calcDiagonalPXAndMapBounds(mapContainer),
      mapBounds: this.prepareMapCorners(MAP),
      hexResolution: zoomCurrent - 4,
    };
  }

  prepareMapCorners(MAP: L.Map): MapBoundries {
    const b: MapBoundries = JSON.parse(JSON.stringify(MAP.getBounds()));
    const boundriesCoordinates: MapBoundries = {
      ...b,
      _southEast: {
        lat: b._southWest.lat,
        lng: b._northEast.lng,
      },
      _northWest: {
        lat: b._northEast.lat,
        lng: b._southWest.lng,
      },
    };

    return boundriesCoordinates;
  }

  calcDiagonalPXAndMapBounds(mapContainer: ElementRef): number {
    const mapBox = mapContainer.nativeElement;
    const diagonalBoxPX = Math.sqrt(
      Math.pow(mapBox.offsetWidth, 2) + Math.pow(mapBox.offsetHeight, 2)
    ); // pitagoras

    return diagonalBoxPX;
  }
}

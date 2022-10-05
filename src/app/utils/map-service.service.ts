import { ElementRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MapBoundries } from '../shared/types/map';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  constructor(private http: HttpClient) { }

  getHexagons (resolution, diagonalBoxPX, mapBounds, filtrationData): any {
    return lastValueFrom( this.http.post('http://localhost:3010/hexagons', {
      resolution,
      diagonalBoxPX,
      mapBounds,
      filtrationData
    }) );
  }

  getPOIsByHexagon (hexIndex, filtrationData): any {
    return lastValueFrom( this.http.post('http://localhost:3010/poi', {
      hexIndex,
      filtrationData
    }) );
  }

  getPOIsTags (poiId): any {
    return lastValueFrom( this.http.get(`http://localhost:3010/tags/${poiId}`))
  }

  getPOIs (diagonalBoxPX, mapBounds, filtrationData): any {
    return lastValueFrom( this.http.post('http://localhost:3010/pois', {
      diagonalBoxPX,
      mapBounds,
      filtrationData
    }) );
  }

  getMapParams (mapContainer: ElementRef, zoomCurrent: number, MAP: L.Map) {
    return {
      diagonalBoxPX: this.calcDiagonalPXAndMapBounds(mapContainer),
      mapBounds: this.prepareMapCorners(MAP),
      hexResolution: zoomCurrent - 4
    };
  }

  prepareMapCorners (MAP: L.Map): MapBoundries {
    const b: MapBoundries = JSON.parse(JSON.stringify(MAP.getBounds()));
    const boundriesCoordinates: MapBoundries = {
      ...b,
      _southEast: {
        lat: b._southWest.lat,
        lng: b._northEast.lng
      },
      _northWest: {
        lat: b._northEast.lat,
        lng: b._southWest.lng
      }
    };
    
    return boundriesCoordinates;		
  }

  calcDiagonalPXAndMapBounds (mapContainer: ElementRef): number {
    const mapBox = mapContainer.nativeElement;
    const diagonalBoxPX = Math.sqrt(Math.pow(mapBox.offsetWidth, 2) + Math.pow(mapBox.offsetHeight, 2)); // pitagoras
    
    return diagonalBoxPX;
  }
}
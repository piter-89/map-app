import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectHexagons } from '../state/hexagons.selectors';
import { Hexagon, MapBoundries } from '../shared/types/map';
import { Filters } from '../shared/types/filtration';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient, private store: Store) { }

  private getData (url: string): any {
    return lastValueFrom(this.http.get(url));
  }

  getTags (): Promise<Tagg> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // const data: any = await this.getData('http://localhost:3010/unique-tags-values');
        let data: any = '{"res":[{"name":"Manufacturer","value":"Fuhrländer"},{"name":"Manufacturer","value":"Enercon"},{"name":"Manufacturer","value":"Siemens"},{"name":"Manufacturer","value":"GE Wind Energy"},{"name":"Manufacturer","value":"Senvion"}]}';
        data = JSON.parse(data);
        console.log('data', data);
        resolve(data && data.res && data.res.length ? data.res[0] : {});
      }, 1000);
    });
  }

  getTags2 () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // const data: any = await this.getData('http://localhost:3010/unique-tags-values');
        let data: any = '{"res":[{"name":"Manufacturer","value":"Fuhrländer"},{"name":"Manufacturer","value":"Enercon"},{"name":"Manufacturer","value":"Siemens"},{"name":"Manufacturer","value":"GE Wind Energy"},{"name":"Manufacturer","value":"Senvion"}]}';
        data = JSON.parse(data);
        console.log('data', data);
        resolve(data && data.res && data.res.length ? data.res[0] : {});
      }, 1000);
    });
  }

  async getHexagonsFromStore (): Promise<any> {
    const hexagons$ = this.store.select(selectHexagons);
    const hexagons: Array<Hexagon> = await lastValueFrom(hexagons$.pipe(take(1)));
    return hexagons;
  }

  postData(url: string, data): any {
    return lastValueFrom(this.http.post(url, data));
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

}

type Tagg = {
  name: string,
  value: string
}
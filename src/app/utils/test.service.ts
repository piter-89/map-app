import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  private getData (url: string): any {
    return lastValueFrom(this.http.get(url));
  }

  async getTags () {
    // const data: any = await this.getData('http://localhost:3010/unique-tags-values');
    let data: any = '{"res":[{"name":"Manufacturer","value":"Fuhrländer"},{"name":"Manufacturer","value":"Enercon"},{"name":"Manufacturer","value":"Siemens"},{"name":"Manufacturer","value":"GE Wind Energy"},{"name":"Manufacturer","value":"Senvion"}]}';
    data = JSON.parse(data);
    console.log('data', data);
    return data && data.res && data.res.length ? data.res[0] : {};
  }
}

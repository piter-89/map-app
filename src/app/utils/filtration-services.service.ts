import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';
import { Filters, Selects, TagValue } from '../shared/types/filtration';

@Injectable({
  providedIn: 'root'
})
export class FiltrationServicesService {

  constructor(private http: HttpClient) { }

  getTags (): Promise<any> {
    return lastValueFrom( this.http.get('http://localhost:3010/unique-tags-values') );
  }

  reduceEmptyValuesInObj (obj: Filters): Filters {
    return Object.fromEntries(Object.entries(obj).filter(( [n, v] ) => v));
  }

  async getCountriesList (): Promise<Array<string>> {
    const res: any = await lastValueFrom( this.http.get('http://localhost:3010/countries-capacities') )
    const countriesIsoCodes = res.res.data
      .filter(item => parseFloat(item.wind_capacity) !== 0)
      .map(item => item.country_code);

    return countriesIsoCodes;
  }

  async getUniqueTagsValues (): Promise<Selects> {
    const { res: tagsValues }: { res: Array<TagValue>} = await this.getTags();
    
    const manufactures = tagsValues.filter((tag) => tag.name.toLowerCase() === 'manufacturer').map((tag) => tag.value);
    const model = tagsValues.filter((tag) => tag.name.toLowerCase() === 'model').map((tag) => tag.value);
    const operator = tagsValues.filter((tag) => tag.name.toLowerCase() === 'operator').map((tag) => tag.value);
    
    return {
      manufactures,
      model,
      operator
    }
  }

  generateYears (startYear: number): Array<number> {
    let year = startYear;
    const arr: Array<number> = [];
    const currentyear = (new Date).getFullYear();

    do {
        arr.push(year);
        year++;
    } while(year <= currentyear)

    return arr;
  }
}

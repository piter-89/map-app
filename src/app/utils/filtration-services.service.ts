import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltrationServicesService {

  constructor(private http: HttpClient) { }

  getTags (): any {
    return lastValueFrom( this.http.get('http://localhost:3010/unique-tags-values') );
  }

  async getUniqueTagsValues () {
    const { res: tagsValues } = await this.getTags();
	
    const manufactures = tagsValues.filter((tag) => tag.name.toLowerCase() === 'manufacturer').map((tag) => tag.value);
    const model = tagsValues.filter((tag) => tag.name.toLowerCase() === 'model').map((tag) => tag.value);
    const operator = tagsValues.filter((tag) => tag.name.toLowerCase() === 'operator').map((tag) => tag.value);
    
    return {
      manufactures,
      model,
      operator
    }
  }
}

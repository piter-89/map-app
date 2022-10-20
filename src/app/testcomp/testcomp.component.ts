import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TestService } from '../utils/test.service';
import { DOCUMENT } from '@angular/common';
import { Hexagon } from '../shared/types/map';

@Component({
  selector: 'app-testcomp',
  templateUrl: './testcomp.component.html',
  styleUrls: ['./testcomp.component.scss']
})
export class TestcompComponent implements AfterViewInit {
  public name = '';
  public value = '';
  public nameAfterOnInit = '';

  @ViewChild ('elRef') divContainer: ElementRef;

  constructor(private testService: TestService) { }

  async tag () {
    const data = await this.testService.getTags();
    
    this.name = data.name || '';
    this.value = data.value || '';
    this.nameAfterOnInit = 'Mike';
    this.addHtmlEl();
  }

  async addHtmlEl () {
    const hexagonsNew: Array<Hexagon> = await this.testService.getHexagons(10, 20, {"_southWest":{"lat":44.5826428195842,"lng":13.150634765625002},"_northEast":{"lat":49.49667452747045,"lng":24.455566406250004},"_southEast":{"lat":44.5826428195842,"lng":24.455566406250004},"_northWest":{"lat":49.49667452747045,"lng":13.150634765625002}}, {});
    // console.log('hexagonsNew', hexagonsNew.length);

    const data = await this.testService.getTags();
    // console.log('LOG 1', data);

    const data2 = await this.testService.getTags2();
    // console.log('LOG 2', data2);

    const data3 = await this.testService.getHexagonsFromStore();
    // console.log('LOG 3', data3);
    
    let el = document.querySelector('.ext-content');
    if (el && data && data3.name) {
      // console.log('LOG 4', data3.name);
      el.innerHTML = '<h1>' + data3.name + '</h1>';
    }
    
  }

  ngAfterViewInit(): void {
    this.tag();
  }
  // ngOnInit(): void {
  //   this.tag();
  // }

}
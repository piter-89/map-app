import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MapServiceService } from '../utils/map-service.service';
import * as L from 'leaflet'

import { MapComponent } from './map.component';
import { Component } from '@angular/core';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let hostElement: HTMLElement;
  let getHexagonsSpy: jasmine.Spy;

  beforeEach(async () => {
    const testHexagons = '[{"id":"7661c122-cde2-40e9-b7e8-d1d8cb9a5f52","hex_index":"831e1cfffffffff                                                 ","resolution":3,"hexagon":"0103000020E61000000100000007000000363A2B144F7D3140106FABF4099E4740A913CD315D7F314000E34DC4F14F4740FBBFCC7E544F3240EFE44274C92A474029FFA5D4401F334036444967765347402D5389FA7320334013A8E7A8A6A14740E61392EE774E32407ACD54D313C74740363A2B144F7D3140106FABF4099E4740","pois_count":7,"center":"0101000020E61000002048DD12E74E3240756ACDC936794740","centertxt":[46.94698450594016,18.308213404678213],"nodes":[[47.23467882509988,17.489487896493493],[46.62456563761771,17.49751578575857],[46.334272892630786,18.30988304613855],[46.65205088689292,19.122082987333815],[47.26289855300288,19.126769693876827],[47.55529252663378,18.306517515815266],[47.23467882509988,17.489487896493493]]},{"id":"ec684e98-65c9-4926-9a01-f96e5896ae13","hex_index":"831e0efffffffff                                                 ","resolution":3,"hexagon":"0103000020E6100000010000000700000015ACF32DDCF633402A159FAE97164840F2693739F5F33340C47591E13BC9474068694E31D0C43440858B451846A24740DF70F94F539A3540CD9C987B5EC84740FE060B7594A0354016856D98C1154840C9BF4D5BF8CD34400A8697FE063D484015ACF32DDCF633402A159FAE97164840","pois_count":3,"center":"0101000020E61000005011EA035BC9344078D5A431F1EF4740","centertxt":[47.87454815434006,20.786545033116738],"nodes":[[48.1765039707919,19.96429717253712],[47.572139926934625,19.952960563687107],[47.26776412387611,20.76880176700925],[47.5653833861521,21.60283374633661],[48.1699705633893,21.627265277092185],[48.476775955186966,20.80457087181256],[48.1765039707919,19.96429717253712]]},{"id":"3e0f8d5d-f9a8-47f8-b852-07260f87a83c","hex_index":"831e02fffffffff                                                 ","resolution":3,"hexagon":"0103000020E610000001000000070000007E788AE5C9A63040F8CA1A421A0F4840F1C3ED168CAA3040829AA1E9ECC14740363A2B144F7D3140106FABF4099E4740E61392EE774E32407ACD54D313C74740D2CF7307074E32406368CEAB5D1448401E83EFC4197931407446F015833848407E788AE5C9A63040F8CA1A421A0F4840","pois_count":765,"center":"0101000020E6100000B87D69AB387B31400E08F5A990EB4740","centertxt":[47.8403522917216,17.481333459143315],"nodes":[[48.11798883732075,16.651518198305432],[47.51504249945448,16.666200097130005],[47.23467882509988,17.489487896493493],[47.55529252663378,18.306517515815266],[48.15910861567024,18.304794755720486],[48.44150041801632,17.473049458002713],[48.11798883732075,16.651518198305432]]},{"id":"d4f4f68b-330e-4338-8e1d-a629af77bef1","hex_index":"831e1dfffffffff                                                 ","resolution":3,"hexagon":"0103000020E610000001000000070000002D5389FA7320334013A8E7A8A6A1474029FFA5D4401F334036444967765347401E1ED4D849EE33408A7F9217CC2C47402383ED7457C03440DCED24830854474068694E31D0C43440858B451846A24740F2693739F5F33340C47591E13BC947402D5389FA7320334013A8E7A8A6A14740","pois_count":3,"center":"0101000020E6100000C38983DE19F133403FD66D624C7B4740","centertxt":[46.96326856959467,19.94180098258381],"nodes":[[47.26289855300288,19.126769693876827],[46.65205088689292,19.122082987333815],[46.3499783959697,19.930814315592322],[46.6565097742384,20.751334484087362],[47.26776412387611,20.76880176700925],[47.572139926934625,19.952960563687107],[47.26289855300288,19.126769693876827]]},{"id":"a8004527-4503-4487-b791-85420b6a06b8","hex_index":"831e11fffffffff                                                 ","resolution":3,"hexagon":"0103000020E610000001000000070000001802BEAF1CB82F40BBABCB4B78974740A59FA0D0AAC22F40966CF4C78249474092510FECE3B130405CE8A852DD254740A913CD315D7F314000E34DC4F14F4740363A2B144F7D3140106FABF4099E4740F1C3ED168CAA3040829AA1E9ECC147401802BEAF1CB82F40BBABCB4B78974740","pois_count":29,"center":"0101000020E6100000ED73E0503FAE30406C1B95F82C744740","centertxt":[46.90762240677472,16.680653624342018],"nodes":[[47.18335864491333,15.859593860573156],[46.57430362162374,15.880209464652419],[46.295816738581124,16.694884065380002],[46.62456563761771,17.49751578575857],[47.23467882509988,17.489487896493493],[47.51504249945448,16.666200097130005],[47.18335864491333,15.859593860573156]]}]';

    const mapServiceService = jasmine.createSpyObj('MapServiceService', ['getHexagons']);
    getHexagonsSpy = mapServiceService.getHexagons.and.returnValue(JSON.parse(testHexagons));
    
    await TestBed.configureTestingModule({
      declarations: [ MapComponent, MockFiltrationComponent, MockTestComponent ],
      providers: [
        provideMockStore({}),
        { provide: MapServiceService, useValue: MapServiceService },
        { provide: L, useValue: L }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the map', () => {
    expect(hostElement.querySelector('.leaflet-map-pane')).toBeTruthy();
  });

  it('should load some hexagons', () => {
    fixture.detectChanges();  // onInit()
    
    expect(hostElement.querySelector('.hexagon')).toBeTruthy();
  });

  // it('each hexagon should have center icon', () => {
  //   const hexagonsAll = hostElement.querySelectorAll('.hexagon');
  //   const hexCenterIconsAll = hostElement.querySelectorAll('.hex-center-icon');

  //   expect(hexagonsAll.length).toEqual(hexCenterIconsAll.length);
  // });

  // it('each center icon should have a number inside', () => {
  //   const hexagonsAll = hostElement.querySelectorAll('.hexagon');
  //   const hexCenterIconsAll = hostElement.querySelectorAll('.hex-center-icon');
    
  //   const values: Array<number> = [];
  //   hostElement.querySelectorAll('.hex-center-icon').forEach((item) => {
  //     const text: string = item.textContent ? item.textContent : '';
  //     values.push(parseInt(text, 10));
  //   });

  //   expect(values).not.toContain(NaN);
  // });
});

@Component({
  selector: 'app-filtration',
  template: ''
})
class MockFiltrationComponent {
}

@Component({
  selector: 'app-testcomp',
  template: ''
})
class MockTestComponent {
}


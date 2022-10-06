import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { lastValueFrom, take } from 'rxjs';
import { MapServiceService } from '../utils/map-service.service';
import { Store, select } from '@ngrx/store';
import { addHexagons } from '../state/hexagons.actions';
import { addLayer, removeLayers, addPOIs, removePOIs } from '../state/map.actions';
import { selectHexagons } from '../state/hexagons.selectors';
import { selectLayers, selectPOIs } from '../state/map.selectors';
import { Filters } from '../shared/types/filtration';
import { Poi } from '../shared/types/map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapRef') mapContainer: ElementRef;

  private MAP: L.Map;
  private mapLayers: Array<L.Layer> = [];
  private filtrationData: Filters;
  private maxH3Resolution = 7;
	private minH3Resolution = 3;
  private zoomTreshold = 12;
  private zoomStart = 7;
  private zoomCurrent = this.zoomStart;
  
  hexagons$ = this.store.select(selectHexagons);
  POIs$ = this.store.select(selectPOIs);

  constructor(private http: HttpClient, private mapService: MapServiceService, private store: Store) { }

  private initMap () {
    const zoomStart = 7;
    this.MAP = L.map('map').setView([47.1, 18.8], zoomStart);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap'
		}).addTo(this.MAP);
  }

  async ngAfterViewInit() {
    this.initMap();
    this.runMap();
  }

  setFiltrationData (data: Filters) {
    console.log('EVENT', data);
    this.filtrationData = data;
    this.drawElements();
  }

  runMap () {
    this.drawElements();

    this.MAP.on('zoom, moveend', (event) => {
      console.log("ZOOM EVENT START");
      this.zoomCurrent = event.target._zoom;
      this.drawElements();
    });
  }

  async drawElements (isHexWithSinglePOI?: boolean) {
    if(this.zoomCurrent >= this.zoomTreshold || isHexWithSinglePOI) { // duzy zoom - wyswietla wszystkie POI
      this.drawPOIsByMap();
    } else {
      this.drawHexagons();
    }
  }

  clearMap () {
    this.mapLayers.forEach( layer => {
      layer.remove();
    });
  }

  async drawPOIsByMap () {
    const { diagonalBoxPX, mapBounds } = this.mapService.getMapParams(this.mapContainer, this.zoomCurrent, this.MAP);
    const POIsNew: Poi[] = await this.mapService.getPOIs(diagonalBoxPX, mapBounds, this.filtrationData);

    this.store.dispatch(addPOIs({ POIs: POIsNew }));
    this.clearMap();

    const POIS: any = await lastValueFrom(this.store.select(selectPOIs).pipe(take(1)));

    POIS.forEach( poi => {
      const marker = this.drawPOI(poi);
      this.mapLayers.push(marker);
    });
  }

  async drawPOIsByHexagon (hexIndex) {
    const { res: POIsNew } = await this.mapService.getPOIsByHexagon(hexIndex, this.filtrationData);
    
    this.store.dispatch(addPOIs({ POIs: POIsNew}));

    const POIS: any = await lastValueFrom(this.store.select(selectPOIs).pipe(take(1)));

    POIS.forEach( poi => {
      const marker = this.drawPOI(poi);
      this.mapLayers.push(marker);
    });
  }

  drawPOI (item) {
    let windPowerIcon = L.icon({
      iconUrl: '/assets/windmill.png',
      iconSize: [22, 28]
    });
    
    if(typeof item === 'undefined') {
      debugger;
    }

    let marker = L.marker([item.coordinates[0], item.coordinates[1]], { icon: windPowerIcon }).addTo(this.MAP);
    
    marker.bindPopup('<b>Loading...</b>');
    
    marker.on('mouseover', async (event) => {
      const popup = event.target.getPopup();
      const { res: tags } = await this.mapService.getPOIsTags(item.id);
      const newContent = tags.reduce((acc, value) => {
        return acc += `<strong>${value.name}</strong>: ${value.value}<br>`;
      }, '');
      
      popup.setContent(newContent);
      popup.update();
      event.target.openPopup();
    });
    marker.on('mouseout', function (event) {
      event.target.closePopup();
    });
    
    return marker;
  }

  async drawHexagons () {
    let { diagonalBoxPX, mapBounds, hexResolution } = this.mapService.getMapParams(this.mapContainer, this.zoomCurrent, this.MAP);
		const { res: hexagonsNew } = await this.mapService.getHexagons(hexResolution, diagonalBoxPX, mapBounds, this.filtrationData);
    
    // TUTAJ TO WSZYSTKO PRZEOBIC - ZMIANA HEXAGONOW W STORZE POWINNA BYC NA SUBSCRIEBE I TO CO PONIZEJ W FILTER POWINNO DZIAC SIE AUTOMATYCZNIE PO UPDATCIE W STORZE - TJ REACTYWNIE

    this.store.dispatch(addHexagons({ hexagons: hexagonsNew }));
    this.clearMap();

    this.store.dispatch(removePOIs());

    hexResolution = hexResolution < this.minH3Resolution ? this.minH3Resolution : hexResolution; // gdy oddala sie zoom to hexagony zostaja na minimalnej rozdzielczosci = 3
    hexResolution = hexResolution > this.maxH3Resolution ? this.maxH3Resolution : hexResolution; // gdy przybliza sie zoom to hexagony zostaja na maksymalnej rozdzielczosci = 7

    const HEXAGONS: any = await lastValueFrom(this.hexagons$.pipe(take(1)));

    HEXAGONS.filter( hex => hex.resolution === hexResolution).forEach( hex => {
      if (hex.pois_count === 1) {
        this.drawPOIsByHexagon(hex.hex_index);
      } else {
        const hexCenterIcon = L.divIcon({
          className: 'hex-center-icon',
          html: '<span>' + hex.pois_count + '</span>'
        });
        
        const polygon = L.polygon(hex.nodes).addTo(this.MAP);
        const marker = L.marker(hex.centertxt, { icon: hexCenterIcon }).addTo(this.MAP);
        this.mapLayers.push(polygon);
        this.mapLayers.push(marker);
      }
    });
  };

}

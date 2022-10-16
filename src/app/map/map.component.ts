import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { lastValueFrom, Observable, take } from 'rxjs';
import { MapServiceService } from '../utils/map-service.service';
import { Store, select } from '@ngrx/store';
import { addHexagons } from '../state/hexagons.actions';
import { addLayer, removeLayers, addPOIs, removePOIs } from '../state/map.actions';
import { selectHexagons } from '../state/hexagons.selectors';
import { selectLayers, selectPOIs } from '../state/map.selectors';
import { Filters } from '../shared/types/filtration';
import { Hexagon, Poi, PoisTag } from '../shared/types/map';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapRef') mapContainer: ElementRef;

  private MAP: L.Map;
  private mapLayers: Array<L.Layer> = [];
  private layersUnderDrawing: Array<number> = [];
  private filtrationData: Filters;
  private maxH3Resolution = 7;
	private minH3Resolution = 3;
  private zoomTreshold = 12;
  private zoomStart = 7;
  private zoomCurrent = this.zoomStart;
  
  hexagons$ = this.store.select(selectHexagons);
  POIs$ = this.store.select(selectPOIs);

  constructor(private mapService: MapServiceService, private store: Store) { }

  private initMap () {
    const zoomStart = 7;
    this.MAP = L.map('map').setView([47.1, 18.8], zoomStart);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap'
		}).addTo(this.MAP);
  }

  ngAfterViewInit() {
    this.initMap();
    this.runMap();
  }

  setFiltrationData (data: Filters) {
    this.filtrationData = data;
    this.drawElements();
  }

  runMap () {
    this.drawElements();

    this.MAP.on('zoom, moveend', (event) => {
      this.zoomCurrent = event.target._zoom;
      this.drawElements();
    });

    this.MAP.on('layeradd', (evt) => {
      this.mapLayers;
      // console.log(evt.target);
    });
  }

  drawElements (isHexWithSinglePOI?: boolean) {
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
    const POIsNew: Array<Poi> = await this.mapService.getPOIs(diagonalBoxPX, mapBounds, this.filtrationData);
    
    this.store.dispatch(addPOIs({ POIs: POIsNew }));
    this.clearMap();

    const POIS: Array<Poi> = await lastValueFrom(this.store.select(selectPOIs).pipe(take(1)));

    POIS.forEach( poi => {
      const marker = this.drawPOI(poi);
      this.mapLayers.push(marker);
    });
  }

  async drawPOIsByHexagon (hexIndex: string) {
    const POIsNew: Array<Poi> = await this.mapService.getPOIsByHexagon(hexIndex, this.filtrationData);
    this.store.dispatch(addPOIs({ POIs: POIsNew}));

    const POIS: Array<Poi> = await lastValueFrom(this.store.select(selectPOIs).pipe(take(1)));

    POIS.forEach( poi => {
      const marker = this.drawPOI(poi);
      this.mapLayers.push(marker);
    });
  }

  drawPOI (item: Poi) {
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
      const popup: L.Popup = event.target.getPopup();
      const tags: Array<PoisTag> = await this.mapService.getPOIsTags(item.id);
      const newContent: string = tags.reduce((acc, value) => {
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
		const hexagonsNew: Array<Hexagon> = await this.mapService.getHexagons(hexResolution, diagonalBoxPX, mapBounds, this.filtrationData);

    // TUTAJ TO WSZYSTKO PRZEOBIC - ZMIANA HEXAGONOW W STORZE POWINNA BYC NA SUBSCRIEBE I TO CO PONIZEJ W FILTER POWINNO DZIAC SIE AUTOMATYCZNIE PO UPDATCIE W STORZE - TJ REACTYWNIE

    this.store.dispatch(addHexagons({ hexagons: hexagonsNew }));
    this.clearMap();

    this.store.dispatch(removePOIs());

    hexResolution = hexResolution < this.minH3Resolution ? this.minH3Resolution : hexResolution; // gdy oddala sie zoom to hexagony zostaja na minimalnej rozdzielczosci = 3
    hexResolution = hexResolution > this.maxH3Resolution ? this.maxH3Resolution : hexResolution; // gdy przybliza sie zoom to hexagony zostaja na maksymalnej rozdzielczosci = 7

    // const HEXAGONS: Array<Hexagon> = await lastValueFrom(this.hexagons$.pipe(take(1))); to trzeba opakowac inną metodą i ją też zmockować aby test działał!
    const HEXAGONS: Array<Hexagon> = hexagonsNew;
    
    HEXAGONS.filter( hex => hex.resolution === hexResolution).forEach( hex => {
      if (hex.pois_count === 1) {
        this.drawPOIsByHexagon(hex.hex_index);
      } else {
        const hexCenterIcon = L.divIcon({
          className: 'hex-center-icon',
          html: '<span>' + hex.pois_count + '</span>'
        });
        
        const polygon: any = L.polygon(hex.nodes, { className: 'hexagon' }).addTo(this.MAP);
        const marker = L.marker(hex.centertxt, { icon: hexCenterIcon }).addTo(this.MAP);
        
        this.mapLayers.push(polygon);
        this.mapLayers.push(marker);
      }
    });
    console.log('HEXAGONS ADDED');
  };

}

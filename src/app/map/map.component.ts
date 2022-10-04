import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { lastValueFrom, take } from 'rxjs';
import { MapServiceService } from '../utils/map-service.service';
import { Store, select } from '@ngrx/store';
import { addHexagons } from '../state/hexagons.actions';
import { addLayer, removeLayers, addPOIs, removePOIs } from '../state/map.actions';
import { selectHexagons } from '../state/hexagons.selectors';
import { selectLayers, selectPOIs } from '../state/map.selectors';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapRef') mapContainer: any;

  private MAP: any;
  private mapLayers: Array<any> = [];
  private filtrationData = null;
  private maxH3Resolution = 7;
	private minH3Resolution = 3;
  private zoomTreshold = 12;
  private zoomStart = 7;
  private zoomCurrent = this.zoomStart;
  
  hexagons$ = this.store.select(selectHexagons);
  POIs$ = this.store.select(selectPOIs);

  private initMap (): void {
    const zoomStart = 7;
    this.MAP = L.map('map').setView([47.1, 18.8], zoomStart);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap'
		}).addTo(this.MAP);
  }

  constructor(private http: HttpClient, private mapService: MapServiceService, private store: Store) { }

  async ngAfterViewInit(): Promise<any> {
		
    this.initMap();
    this.runMap();

    const req = this.http.get('http://localhost:3010/unique-tags-values');
		
    const data = await lastValueFrom(req);
    console.log(data);

    // req.subscribe(data => {
    //   console.log(data);
    // })

    // req.subscribe(data => {
    //   console.log(data);
    // })

    const reqPost = this.http.post('http://localhost:3010/hexagons', {"resolution":3,"diagonalBoxPX":1075.107436491814,"mapBounds":{"_southWest":{"lat":45.259422036351694,"lng":13.524169921875002},"_northEast":{"lat":48.879167148960214,"lng":24.071044921875004},"_southEast":{"lat":45.259422036351694,"lng":24.071044921875004},"_northWest":{"lat":48.879167148960214,"lng":13.524169921875002}},"filtrationData":null}).subscribe(data => {``
      console.log(data);
    })
  }

  setFiltrationData (data) {
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

  async drawElements (isHexWithSinglePOI?) {
    if(this.zoomCurrent >= this.zoomTreshold || isHexWithSinglePOI) { // duzy zoom - wyswietla wszystkie POI
      this.drawPOIsByMap();
    } else {
      this.drawHexagons();
    }
  }

  calcDiagonalPXAndMapBounds () {
    const mapBox = this.mapContainer.nativeElement;
    const diagonalBoxPX = Math.sqrt(Math.pow(mapBox.offsetWidth, 2) + Math.pow(mapBox.offsetHeight, 2)); // pitagoras
    
    return diagonalBoxPX;
  }

  prepareMapCorners () {
    const b = JSON.parse(JSON.stringify(this.MAP.getBounds()));
    const boundriesCoordinates = {
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

  getMapParams () {
    return {
      diagonalBoxPX: this.calcDiagonalPXAndMapBounds(),
      mapBounds: this.prepareMapCorners(),
      hexResolution: this.zoomCurrent - 4
    };
  }

  clearMap () {
    this.mapLayers.forEach( layer => {
      layer.remove();
    });
  }

  async drawPOIsByMap () {
    const { diagonalBoxPX, mapBounds } = this.getMapParams();
    const { res: POIsNew } = await this.mapService.getPOIs(diagonalBoxPX, mapBounds, this.filtrationData);
    
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
    let { diagonalBoxPX, mapBounds, hexResolution } = this.getMapParams();
		const { res: hexagonsNew } = await this.mapService.getHexagons(hexResolution, diagonalBoxPX, mapBounds, this.filtrationData);
    
    // TUTAJ TO WSZYSTKO PRZEOBIC - ZMIANA HEXAGONOW W STORZE POWINNA BYC NA SUBSCRIEBE I TO CO PONIZEJ W FILTER POWINNO DZIAC SIE AUTOMATYCZNIE PO UPDATCIE W STORZE - TJ REACTYWNIE

    this.store.dispatch(addHexagons({ hexagons: hexagonsNew }));
    this.clearMap();

    this.hexagons$.subscribe(data => {
      console.log(data);
    });

    this.store.dispatch(removePOIs());

    hexResolution = hexResolution < this.minH3Resolution ? this.minH3Resolution : hexResolution; // gdy oddala sie zoom to hexagony zostaja na minimalnej rozdzielczosci = 3
    hexResolution = hexResolution > this.maxH3Resolution ? this.maxH3Resolution : hexResolution; // gdy przybliza sie zoom to hexagony zostaja na maksymalnej rozdzielczosci = 7

    const HEXAGONS: any = await lastValueFrom(this.store.select(selectHexagons).pipe(take(1)));

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

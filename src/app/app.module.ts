import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { hexagonsReducer } from './state/hexagons.reducer';
import { layersReducer, poisReducer } from './state/map.reducer';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FiltrationComponent } from './filtration/filtration.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FiltrationComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ hexagons: hexagonsReducer, layers: layersReducer, POIs: poisReducer }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

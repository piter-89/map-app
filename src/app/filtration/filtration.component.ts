import {
  Component,
  EventEmitter,
  OnInit,
  AfterViewInit,
  Output,
  Input
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FiltrationServicesService } from '../utils/filtration-services.service';
import { Filters, Selects } from '../shared/types/filtration';
import { DualHRangeBar } from 'dual-range-bar';

@Component({
  selector: 'app-filtration',
  templateUrl: './filtration.component.html',
  styleUrls: ['./filtration.component.scss'],
})
export class FiltrationComponent implements OnInit, AfterViewInit {
  @Input('loading') loading = false;

  public selectManufactures: Array<string> = [];
  public selectModel: Array<string> = [];
  public selectOperator: Array<string> = [];
  public selectCountries: Array<string> = [];
  public selectYears: Array<number> = [];
  public filtrationForm: FormGroup = this.fb.group({
    selectCountries: [''],
    selectManufacturer: [''],
    selectModel: [''],
    selectOperator: [''],
    altitudeFrom: [''],
    altitudeTo: [''],
    electricityOutputFrom: [''],
    electricityOutputTo: [''],
    heightFrom: [''],
    heightTo: [''],
    rotorDiameterFrom: [''],
    rotorDiameterTo: [''],
    startDateFrom: [''],
    startDateTo: [''],
  });
  public drbarLoaders = {
    altitude: false,
    electricityOutput: false,
    height: false,
    rotorDiameter: false
  }

  private formOldState = {};
  private scrollUpdateTimeout: any;
  private drbars: any = {};
  private drbarBounds = {
    altitudeFrom: 0,
    altitudeTo: 2000,
    electricityOutputFrom: 0,
    electricityOutputTo: 5000,
    heightFrom: 0,
    heightTo: 300,
    rotorDiameterFrom: 0,
    rotorDiameterTo: 200,
  }
  
  @Output() submitFormEv = new EventEmitter<Filters>();

  constructor(
    private fb: FormBuilder,
    private filtrationService: FiltrationServicesService
  ) {}

  async setFormData() {
    const tagsValues: Selects = await this.filtrationService.getUniqueTagsValues();

    this.selectCountries = await this.filtrationService.getCountriesList();
    this.selectManufactures = tagsValues.manufactures;
    this.selectModel = tagsValues.model;
    this.selectOperator = tagsValues.operator;
    this.selectYears = this.filtrationService.generateYears(1980);
  }

  ngOnInit(): void {
    this.setFormData();
  }

  ngAfterViewInit(): void {
    this.formOldState = this.filtrationForm.value;

    this.drbars['altitude'] = new DualHRangeBar('slider-altitude', {
      lowerBound: this.drbarBounds.altitudeFrom,
      upperBound: this.drbarBounds.altitudeTo,
      minSpan: 200,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    this.drbars['altitude'].addEventListener('update', (e: any) => {
      this.filtrationForm.value.altitudeFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.altitudeTo = parseInt(e.detail.upper);
      console.log('elo updated!');
    });

    setTimeout(() => {
      this.drbars['altitude'].lower = 1000;
    }, 4000);
    
    this.drbars['electricityOutput'] = new DualHRangeBar('slider-electricity-output', {
      lowerBound: this.drbarBounds.electricityOutputFrom,
      upperBound: this.drbarBounds.electricityOutputTo,
      minSpan: 500,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    this.drbars['electricityOutput'].addEventListener('update', (e: any) => {
      this.filtrationForm.value.electricityOutputFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.electricityOutputTo = parseInt(e.detail.upper);
    });

    this.drbars['height'] = new DualHRangeBar('slider-height', {
      lowerBound: this.drbarBounds.heightFrom,
      upperBound: this.drbarBounds.heightTo,
      minSpan: 30,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    this.drbars['height'].addEventListener('update', (e: any) => {
      this.filtrationForm.value.heightFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.heightTo = parseInt(e.detail.upper);
    });

    this.drbars['rotor'] = new DualHRangeBar('slider-rotor', {
      lowerBound: this.drbarBounds.rotorDiameterFrom,
      upperBound: this.drbarBounds.rotorDiameterTo,
      minSpan: 20,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    this.drbars['rotor'].addEventListener('update', (e: any) => {
      this.filtrationForm.value.rotorDiameterFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.rotorDiameterTo = parseInt(e.detail.upper);
    });

    this.formVariablesWatcher();
  }

  private setDrbarActive (name) {
    this.drbarLoaders[name] = true;
  }

  private setDrbarInactive (name) {
    this.drbarLoaders[name] = false;
  }

  private setAllDrbarInactive () {
    Object.keys(this.drbarLoaders).forEach(key => {
      this.drbarLoaders[key] = false;
    });
  }

  formVariablesWatcher () {
    this.filtrationForm.valueChanges.subscribe((fields) => {
      clearTimeout(this.scrollUpdateTimeout);

      const changedFields = this.filtrationService.detectFieldChange(fields, this.formOldState);

      changedFields.forEach(field => {
        this.setDrbarActive(field.keyPure);
      });

      this.scrollUpdateTimeout = setTimeout(() => {
        console.log('heellloooo');
        changedFields.forEach(field => {
          this.setAllDrbarInactive();

          if(field.key.indexOf('From') !== -1) {
            this.drbars[field.yPure].lower = fields[field.key] >= this.drbarBounds[field.key] ? fields[field.key] : this.drbarBounds[field.key];
          }

          if(field.key.indexOf('To') !== -1) {
            this.drbars[field.keyPure].upper = fields[field.key] <= this.drbarBounds[field.key] ? fields[field.key] : this.drbarBounds[field.key];
          }
        });
      }, 500);

      this.formOldState = JSON.parse(JSON.stringify(fields));
    });
  }

  saveFilters() {
    const formPureData: any = this.filtrationForm?.value;
    const formData: Filters =
      this.filtrationService.reduceEmptyValuesInObj(formPureData);

    console.log('FILTERS DATA', formData);
    this.submitFormEv.emit(formData);
  }

  clearFilters() {
    this.filtrationForm.reset();
    this.submitFormEv.emit({});
  }
}

import {
  Component,
  EventEmitter,
  OnInit,
  AfterViewInit,
  Output
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
    const drbarAltitude = new DualHRangeBar('slider-altitude', {
      lowerBound: 0,
      upperBound: 2000,
      minSpan: 200,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    drbarAltitude.addEventListener('update', (e: any) => {
      this.filtrationForm.value.altitudeFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.altitudeTo = parseInt(e.detail.upper);
    });

    setTimeout(() => {
      drbarAltitude.lower = 1000;
    }, 2000);

    const drbarElectricityOutput = new DualHRangeBar('slider-electricity-output', {
      lowerBound: 0,
      upperBound: 5000,
      minSpan: 500,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    drbarElectricityOutput.addEventListener('update', (e: any) => {
      this.filtrationForm.value.electricityOutputFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.electricityOutputTo = parseInt(e.detail.upper);
    });

    const drbarHeight = new DualHRangeBar('slider-height', {
      lowerBound: 0,
      upperBound: 300,
      minSpan: 30,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    drbarHeight.addEventListener('update', (e: any) => {
      this.filtrationForm.value.heightFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.heightTo = parseInt(e.detail.upper);
    });

    const drbarRotor = new DualHRangeBar('slider-rotor', {
      lowerBound: 0,
      upperBound: 200,
      minSpan: 20,
      rangeColor: '#6ab187',
      sliderColor: '#295a55',
      sliderActiveColor: '#295a55'
    });

    drbarRotor.addEventListener('update', (e: any) => {
      this.filtrationForm.value.rotorDiameterFrom = parseInt(e.detail.lower);
      this.filtrationForm.value.rotorDiameterTo = parseInt(e.detail.upper);
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

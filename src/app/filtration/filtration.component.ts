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
    description: [''],
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
  }

  ngOnInit(): void {
    this.setFormData();
  }

  ngAfterViewInit(): void {
    const drbarAltitude = new DualHRangeBar('slider-altitude');
    const drbarElectricityOutput = new DualHRangeBar('slider-electricity-output');
    const drbarHeight = new DualHRangeBar('slider-height');
    const drbarRotor = new DualHRangeBar('slider-rotor');
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

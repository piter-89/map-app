import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FiltrationServicesService } from '../utils/filtration-services.service';
import { Filters, Selects } from '../shared/types/filtration';

@Component({
  selector: 'app-filtration',
  templateUrl: './filtration.component.html',
  styleUrls: ['./filtration.component.scss'],
})
export class FiltrationComponent implements OnInit {
  public selectManufactures: Array<string> = [];
  public selectModel: Array<string> = [];
  public selectOperator: Array<string> = [];
  public selectCountries: Array<string> = [];
  public filtrationForm: FormGroup = this.fb.group({
    selectCountries: [''],
    selectManufacturer: [''],
    selectModel: [''],
    selectOperator: [''],
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

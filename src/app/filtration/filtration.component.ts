import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FiltrationServicesService } from '../utils/filtration-services.service';
import { FormData, Selects } from './filtration';

@Component({
  selector: 'app-filtration',
  templateUrl: './filtration.component.html',
  styleUrls: ['./filtration.component.scss'],
})
export class FiltrationComponent implements OnInit {
  public filtrationForm!: FormGroup;
  public selectManufactures: Array<string> = [];
  public selectModel: Array<string> = [];
  public selectOperator: Array<string> = [];

  @Output() submitFormEv = new EventEmitter<FormData>();

  constructor(
    private fb: FormBuilder,
    private filtrationService: FiltrationServicesService
  ) {}

  async setFormData() {
    this.filtrationForm = this.fb.group({
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

    const tagsValues: Selects = await this.filtrationService.getUniqueTagsValues();

    this.selectManufactures = tagsValues.manufactures;
    this.selectModel = tagsValues.model;
    this.selectOperator = tagsValues.operator;
  }

  ngOnInit(): void {
    this.setFormData();
  }

  saveFilters() {
    const formPureData: FormData = this.filtrationForm?.value;
    const formData: FormData =
      this.filtrationService.reduceEmptyValuesInObj(formPureData);

    console.log('FILTERS DATA', formData);
    this.submitFormEv.emit(formData);
  }

  clearFilters() {
    this.filtrationForm.reset();
    this.submitFormEv.emit({});
  }
}

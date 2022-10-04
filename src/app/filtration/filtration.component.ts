import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FiltrationServicesService } from '../utils/filtration-services.service';

@Component({
  selector: 'app-filtration',
  templateUrl: './filtration.component.html',
  styleUrls: ['./filtration.component.scss']
})
export class FiltrationComponent implements OnInit {

  private selectsData;

  public filtrationForm!: FormGroup;
  public selectManufactures = [];
  public selectModel = [];
  public selectOperator = [];

  @ViewChild('formRef') formContainer: any;
  @Output() submitFormEv = new EventEmitter();

  constructor(private fb: FormBuilder, private filtrationService: FiltrationServicesService) { }

  async setFormData () {
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
      description: ['']
    });

    const tagsValues = await this.filtrationService.getUniqueTagsValues();

    this.selectManufactures = tagsValues.manufactures;
    this.selectModel = tagsValues.model;
    this.selectOperator = tagsValues.operator;

    this.selectsData = await this.filtrationService.getUniqueTagsValues();
  }

  ngOnInit(): void {
    this.setFormData();
  }

  saveFilters () {
    const formPureData = this.filtrationForm?.value;
    const formData = this.filtrationService.reduceEmptyValuesInObj(formPureData);
    console.log('FILTERS DATA', formData);
    this.submitFormEv.emit(formData);
  }

  clearFilters () {
    this.formContainer.nativeElement.reset();
    this.submitFormEv.emit(null);
  }

}

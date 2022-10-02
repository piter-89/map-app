import { Component, OnInit } from '@angular/core';
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

  constructor(private fb: FormBuilder, private filtrationService: FiltrationServicesService) { }

  async setFormData () {
    this.filtrationForm = this.fb.group({
      manufacturer: [''],
      model: [''],
      operator: [''],
      electricityOutput: [''],
      height: [''],
      rotorDiameter: [''],
      startDate: [''],
      description: ['']
    });

    this.selectsData = await this.filtrationService.getUniqueTagsValues();
  }

  ngOnInit(): void {
    this.setFormData();
  }

}

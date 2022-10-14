import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FiltrationServicesService } from '../utils/filtration-services.service';

import { FiltrationComponent } from './filtration.component';

describe('FiltrationComponent', () => {
  let component: FiltrationComponent;
  let fixture: ComponentFixture<FiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrationComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: FiltrationServicesService, useValue: FiltrationServicesService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

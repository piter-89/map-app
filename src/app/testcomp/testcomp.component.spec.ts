import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcompComponent } from './testcomp.component';
import { TestService } from '../utils/test.service';

describe('TestcompComponent', () => {
  let component: TestcompComponent;
  let fixture: ComponentFixture<TestcompComponent>;
  let hostElement: HTMLElement;
  let nameElement: HTMLElement | null;
  let valueElement: HTMLElement | null;
  let nameAfterOnInitElement: HTMLElement | null;
  let getTagsSpy: jasmine.Spy;

  beforeEach(async () => {
    const mockTagsData = '{"name":"Manufacturer","value":"Fuhrländer"}';

    const testService = jasmine.createSpyObj('TestService', ['getTags']);
    getTagsSpy = testService.getTags.and.returnValue(JSON.parse(mockTagsData));

    await TestBed.configureTestingModule({
      declarations: [ TestcompComponent ],
      providers: [
        { provide: TestService, useValue: testService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostElement = fixture.nativeElement;
    nameElement = hostElement.querySelector('.tag-name span');
    valueElement = hostElement.querySelector('.tag-value span');
    nameAfterOnInitElement = hostElement.querySelector('.tag-name-after-on-init span');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should say hello', () => {
    expect(hostElement.querySelector('.hello')?.textContent).toBe('testcomp works!');
  });

  it('should name be empty before OnInit', () => {
    expect(nameElement?.textContent).withContext('Nothing displayed').toBe('');
  });

  it('should value be empty before OnInit', () => {
    expect(valueElement?.textContent).withContext('Nothing displayed').toBe('');
  });

  it('should nameAfterOnInit be empty before OnInit', () => {
    expect(nameAfterOnInitElement?.textContent).withContext('Nothing displayed').toBe('');
  });

  it('should show NAME after component initialized', () => {
    fixture.detectChanges();  // onInit()
    
    expect(nameElement?.textContent).toBe('Manufacturer');
    expect(getTagsSpy.calls.any())
      .withContext('getTags called')
      .toBe(true);
  });

  it('should show VALUE after component initialized', () => {
    fixture.detectChanges();  // onInit()
    
    expect(valueElement?.textContent).toBe('Fuhrländer');
    expect(getTagsSpy.calls.any())
      .withContext('getTags called')
      .toBe(true);
  });
});

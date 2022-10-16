import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TestService } from '../utils/test.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-testcomp',
  templateUrl: './testcomp.component.html',
  styleUrls: ['./testcomp.component.scss']
})
export class TestcompComponent implements AfterViewInit {
  public name = '';
  public value = '';
  public nameAfterOnInit = '';

  @ViewChild ('elRef') divContainer: ElementRef;

  constructor(private testService: TestService) { }

  async tag () {
    const data = await this.testService.getTags();
    
    this.name = data.name || '';
    this.value = data.value || '';
    this.nameAfterOnInit = 'Mike';
    this.addHtmlEl();
  }

  async addHtmlEl () {
    const data = await this.testService.getTags();
    //this.divContainer.nativeElement.innerHTML = '<h1>HEEELOOOO</h1>';
    let el = document.querySelector('.ext-content');
    if (el) {
      el.innerHTML = '<h1>HEEELOOOO</h1>';
    }
    
  }

  ngAfterViewInit(): void {
    this.tag();
  }
  // ngOnInit(): void {
  //   this.tag();
  // }

}

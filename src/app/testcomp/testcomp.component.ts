import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TestService } from '../utils/test.service';

@Component({
  selector: 'app-testcomp',
  templateUrl: './testcomp.component.html',
  styleUrls: ['./testcomp.component.scss']
})
export class TestcompComponent implements OnInit {
  public name = '';
  public value = '';
  public nameAfterOnInit = '';

  constructor(private testService: TestService) { }

  async tag () {
    const data = await this.testService.getTags();
    
    this.name = data.name || '';
    this.value = data.value || '';
    this.nameAfterOnInit = 'Mike';
  }

  ngOnInit(): void {
    this.tag();
  }

}

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input('active') active = false;
  @Input('size') size = 20;

  public styles = {};

  constructor() { }

  ngOnInit(): void {
    this.styles = {'width.px': this.size, 'height.px': this.size, 'border-width.px': this.size / 3};
  }

}

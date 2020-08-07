import { Component } from '@angular/core';
import { StockSymbol } from './stock';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'avastocks';
  selectedSymbol: StockSymbol;

  constructor(private appService: AppService) {
    this.appService.selectedSymbol$.subscribe((symbol) => (this.selectedSymbol = symbol));
  }
}

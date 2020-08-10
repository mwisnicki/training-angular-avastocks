import { Component } from '@angular/core';
import { StockSymbol } from './models/stock';
import { AppService } from './services/app.service';

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

import { Component, OnInit } from '@angular/core';

import { StocksService } from '../../stocks.service';
import { Stock } from '../../stock';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stocks: Stock[];
  stocks$: Observable<Stock[]>;

  constructor(
    private stockService: StocksService
  ) {
    this.stocks$ = this.stockService.getStocks();
  }

  ngOnInit(): void {
    this.stocks$.subscribe((stocks) => (this.stocks = stocks));
  }

}

import { Component, OnInit } from '@angular/core';

import { StocksService } from '../stocks.service';
import { Stock } from '../stock';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stocks: Stock[];

  constructor(
    private stockService: StocksService
  ) { }

  ngOnInit(): void {
    this.stockService.getStocks().subscribe((stocks) => (this.stocks = stocks));
  }

}

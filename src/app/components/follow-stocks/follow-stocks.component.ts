import { Component, OnInit } from '@angular/core';
import { Stock, StockTick } from 'src/app/stock';

@Component({
  selector: 'app-follow-stocks',
  templateUrl: './follow-stocks.component.html',
  styleUrls: ['./follow-stocks.component.css'],
})
export class FollowStocksComponent implements OnInit {
  // TODO replace mock
  followedStocks: FollowedStock[] = <any>[
    { stock: { symbol: 'AAPL', lastTick: { price: 253.4 } }, amount: 35 },
    { stock: { symbol: 'MSFT', lastTick: { price: 456 } }, amount: 0 },
    { stock: { symbol: 'GOOG', lastTick: { price: 1005.3 } }, amount: 12 },
  ];

  constructor() {}

  ngOnInit(): void {}

  onStockAdd(stock) {
    console.log('stock add', stock);
  }
}

// TODO simplify this to primitive types?
export interface FollowedStock {
  stock: Stock;
  amount: number;
}

import { Component, OnInit, Input } from '@angular/core';
import { StockTick, StockSymbol } from 'src/app/stock';
import { StocksService } from 'src/app/stocks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-simple-ticker',
  template: `<span *ngIf="tick$ | async as tick">{{ tick && tick.price | number: '1.3-3' }}</span>`,
})
export class SimpleTickerComponent implements OnInit {
  @Input() symbol: StockSymbol;

  tick$: Observable<StockTick>;

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.tick$ = this.stockService.getTick(this.symbol);
  }
}

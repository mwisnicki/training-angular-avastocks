import { Component, OnInit, Input } from '@angular/core';
import { StockTick, StockSymbol } from 'src/app/stock';
import { StocksService } from 'src/app/stocks.service';

@Component({
  selector: 'app-simple-ticker',
  template: `{{tick && tick.price | number:'1.3-3' }}`
})
export class SimpleTickerComponent implements OnInit {
  @Input() symbol: StockSymbol;
  tick: StockTick;

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.stockService.getTick(this.symbol).subscribe(tick => this.tick = tick);
  }
}

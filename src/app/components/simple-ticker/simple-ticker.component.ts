import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StockTick, StockSymbol } from 'src/app/stock';
import { StocksService } from 'src/app/stocks.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-simple-ticker',
  template: `{{ tick && tick.price | number: '1.3-3' }}`,
})
export class SimpleTickerComponent implements OnInit, OnDestroy {
  @Input() symbol: StockSymbol;
  tick: StockTick;

  private dispose$ = new Subject<void>();

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.stockService
      .getTick(this.symbol)
      .pipe(takeUntil(this.dispose$))
      .subscribe((tick) => (this.tick = tick));
  }

  ngOnDestroy(): void {
    console.warn('ticker onDestroy', ...arguments);
    this.dispose$.next();
    this.dispose$.complete();
  }
}

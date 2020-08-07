import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StocksService } from 'src/app/stocks.service';
import { StockSymbol } from 'src/app/stock';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css'],
})
export class StockDetailsComponent implements OnInit {
  @Input() symbol: StockSymbol;

  @Output() unfollow = new EventEmitter<StockSymbol>();

  amount: number;

  constructor(private stockService: StocksService, private app: AppComponent) {}

  ngOnInit(): void {
    this.stockService.getAllocation(this.symbol).subscribe((allocation) => {
      this.amount = allocation?.amount;
    });
  }

  onSymbolClicked() {
    // This should be stored in a service
    this.app.selectedSymbol = this.symbol;
  }

  buy(symbol: StockSymbol, amount: number) {
    console.log('buy', ...arguments);
    this.addTransaction(symbol, amount);
  }

  sell(symbol: StockSymbol, amount: number) {
    this.addTransaction(symbol, -amount);
  }

  private addTransaction(symbol: StockSymbol, amount: number) {
    this.stockService.addTransaction(symbol, amount).subscribe(() => {
      const safeAmount = Math.max(0, (this.amount || 0) + amount);
      this.amount = safeAmount;
    });
  }
}

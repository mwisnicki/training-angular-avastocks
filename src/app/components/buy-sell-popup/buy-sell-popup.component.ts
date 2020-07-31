import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Stock, StockSymbol } from 'src/app/stock';
import { Observable } from 'rxjs';
import { StocksService } from 'src/app/stocks.service';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-buy-sell-popup',
  templateUrl: './buy-sell-popup.component.html',
  styleUrls: ['./buy-sell-popup.component.css'],
})
export class BuySellPopupComponent implements OnInit {
  @ViewChild(PopupComponent) popup: PopupComponent;

  @Input()
  operation: 'buy' | 'sell';

  label: string;

  amount: number;

  symbol: StockSymbol;
  stocks$: Observable<Stock[]>;

  @Output() performed = new EventEmitter();

  constructor(private stockService: StocksService) {
    this.stocks$ = this.stockService.getStocks();
  }

  ngOnInit(): void {
    this.label = {
      buy: 'Buy',
      sell: 'Sell',
    }[this.operation];
  }

  show(symbol?: StockSymbol) {
    if (symbol) this.symbol = symbol;
    this.popup.show();
  }

  onPerformClick() {
    this.popup.hide();
    this.performed.emit(this);
  }
}

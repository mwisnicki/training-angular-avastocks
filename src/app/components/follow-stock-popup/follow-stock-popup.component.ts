import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StocksService } from 'src/app/stocks.service';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/stock';

@Component({
  selector: 'app-follow-stock-popup',
  templateUrl: './follow-stock-popup.component.html',
  styleUrls: ['./follow-stock-popup.component.css']
})
export class FollowStockPopupComponent implements OnInit {

  visible = false;

  selectedStock: Stock;
  stocks$: Observable<Stock[]>;

  @Output() added = new EventEmitter();

  constructor(
    private stockService: StocksService
  ) {
    this.stocks$ = this.stockService.getStocks();
  }

  ngOnInit(): void {
  }

  onAddClick() {
    this.visible = false;
    this.added.emit(this.selectedStock);
  }

}

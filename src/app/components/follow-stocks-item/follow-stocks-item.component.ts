import { Component, OnInit, Input } from '@angular/core';
import { Stock, StockTick, StockSymbol } from 'src/app/stock';
import { StocksService } from 'src/app/stocks.service';

@Component({
  selector: 'app-follow-stocks-item',
  templateUrl: './follow-stocks-item.component.html',
  styleUrls: ['./follow-stocks-item.component.css'],
})
export class FollowStocksItemComponent implements OnInit {
  @Input() symbol: StockSymbol;
  tick: StockTick;

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.stockService.getTick(this.symbol).subscribe(tick => this.tick = tick);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { Stock, StockTick } from 'src/app/stock';

@Component({
  selector: 'app-follow-stocks-item',
  templateUrl: './follow-stocks-item.component.html',
  styleUrls: ['./follow-stocks-item.component.css']
})
export class FollowStocksItemComponent implements OnInit {

  @Input() stock: Stock;
  tick: StockTick;

  constructor() { }

  ngOnInit(): void {
    this.tick = this.stock.lastTick;
    console.log('followed item', this.stock, this.tick);
  }

}

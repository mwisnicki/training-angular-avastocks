import { Component, OnInit, Input } from '@angular/core';
import { StockSymbol } from 'src/app/stock';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css'],
})
export class StockDetailsComponent implements OnInit {
  @Input() symbol: StockSymbol;

  constructor() {}

  ngOnInit(): void {}
}

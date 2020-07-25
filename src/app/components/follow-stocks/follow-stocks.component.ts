import { Component, OnInit } from '@angular/core';
import {
  StocksService,
  WatchlistEntry,
  Allocation,
} from 'src/app/stocks.service';
import { StockSymbol, Stock } from 'src/app/stock';
import { groupBy1 } from 'src/app/utils';

type WatchlistEntryWithAmount = WatchlistEntry & Allocation;

@Component({
  selector: 'app-follow-stocks',
  templateUrl: './follow-stocks.component.html',
  styleUrls: ['./follow-stocks.component.css'],
})
export class FollowStocksComponent implements OnInit {
  watchList: WatchlistEntryWithAmount[];
  allocations: { [key: string]: number };

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.stockService.getUserData().subscribe((ud) => {
      console.log('userData', ud);
      this.allocations = groupBy1(
        ud.allocations,
        (a) => a.symbol,
        (a) => a.amount
      );
      this.watchList = ud.watchList.map((w) => ({
        ...w,
        amount: this.allocations[w.symbol],
      }));
      console.log('allocations', this.allocations);
    });
  }

  follow(symbol: StockSymbol) {
    console.log('follow stock', symbol);
    this.stockService.followStock(symbol).subscribe((ok) => {
      const amount = this.allocations[symbol] || 0;
      // no prop change event when pushing to existing array!
      this.watchList = this.watchList.concat([{ symbol, amount }]);
    });
  }

  unfollow(symbol: StockSymbol) {
    this.stockService.unfollowStock(symbol).subscribe((ok) => {
      this.watchList = this.watchList.filter((w) => w.symbol != symbol);
    });
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
      const safeAmount = Math.max(0, (this.allocations[symbol] || 0) + amount);
      this.allocations[symbol] = safeAmount;
      this.watchList
        .filter((w) => w.symbol == symbol)
        .forEach((w) => (w.amount = safeAmount));
    });
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  StocksService,
  WatchlistEntry,
  Allocation,
} from 'src/app/stocks.service';
import { StockSymbol, Stock } from 'src/app/stock';
import { groupBy1 } from 'src/app/utils';
import { DisposerSubject } from 'src/app/rxUtils';
import { takeUntil } from 'rxjs/operators';

type WatchlistEntryWithAmount = WatchlistEntry & Allocation;

@Component({
  selector: 'app-follow-stocks',
  templateUrl: './follow-stocks.component.html',
  styleUrls: ['./follow-stocks.component.css'],
})
export class FollowStocksComponent implements OnInit, OnDestroy {
  watchList: WatchlistEntryWithAmount[];
  allocations: { [key: string]: number };

  private dispose$ = new DisposerSubject();

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.stockService
      .getUserData()
      .pipe(this.dispose$.own())
      .subscribe((ud) => {
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

  ngOnDestroy() {
    this.dispose$.dispose();
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
}

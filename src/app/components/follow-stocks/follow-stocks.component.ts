import { Component, OnInit, OnDestroy } from '@angular/core';

import { StockSymbol } from 'src/app/models/stock';
import { groupBy1 } from 'src/app/utils';
import { DisposerSubject } from 'src/app/rxUtils';
import { WatchlistEntry, Allocation } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
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
    this.userService.followStock(symbol).subscribe(() => {
      const amount = this.allocations[symbol] || 0;
      // no prop change event when pushing to existing array!
      this.watchList = this.watchList.concat([{ symbol, amount }]);
    });
  }

  unfollow(symbol: StockSymbol) {
    this.userService.unfollowStock(symbol).subscribe(() => {
      this.watchList = this.watchList.filter((w) => w.symbol != symbol);
    });
  }
}

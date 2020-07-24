import { Component, OnInit } from '@angular/core';
import { StocksService, WatchlistEntry } from 'src/app/stocks.service';
import { StockSymbol, Stock } from 'src/app/stock';

@Component({
  selector: 'app-follow-stocks',
  templateUrl: './follow-stocks.component.html',
  styleUrls: ['./follow-stocks.component.css'],
})
export class FollowStocksComponent implements OnInit {
  watchList: WatchlistEntry[];
  allocations: { [key: string]: number }; // TODO I don't really like this

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {
    this.stockService.getUserData().subscribe((ud) => {
      console.log('userData', ud);
      this.watchList = ud.watchList;
      this.allocations = ud.allocations.reduce(
        (acc, x) => ({ ...acc, [x.symbol]: x.amount }),
        {}
      );
      console.log('allocations', this.allocations);
    });
  }

  follow(symbol: StockSymbol) {
    console.log('follow stock', symbol);
    this.stockService.followStock(symbol).subscribe((ok) => {
      this.watchList.push({ symbol });
    });
  }

  unfollow(symbol: StockSymbol) {
    this.stockService.unfollowStock(symbol).subscribe((ok) => {
      this.watchList = this.watchList.filter((w) => w.symbol != symbol);
    });
  }
}

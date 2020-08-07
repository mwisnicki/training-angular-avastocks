import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Stock, StockSymbol } from 'src/app/stock';
import { StocksService } from 'src/app/stocks.service';

import { groupBy1 } from 'src/app/utils';
import { DisposerSubject, bindTo } from 'src/app/rxUtils';
import { PopupComponent } from '../popup/popup.component';
import { WatchlistEntry } from 'src/app/user.service';

@Component({
  selector: 'app-follow-stock-popup',
  templateUrl: './follow-stock-popup.component.html',
  styleUrls: ['./follow-stock-popup.component.css'],
})
export class FollowStockPopupComponent implements OnDestroy, OnChanges {
  @ViewChild(PopupComponent) popup: PopupComponent;

  symbol: StockSymbol;
  symbol$: Observable<StockSymbol>;
  stocks$: Observable<Stock[]>;

  hasMore$: Observable<boolean>;

  dispose$ = new DisposerSubject();

  private watchlistBySymbolSubject$ = new BehaviorSubject<Record<string, WatchlistEntry>>({});

  @Input() watchlist: WatchlistEntry[];

  @Output() added = new EventEmitter<StockSymbol>();

  constructor(private stockService: StocksService) {
    this.stocks$ = combineLatest(
      this.stockService.getStocks().pipe(shareReplay(1)),
      this.watchlistBySymbolSubject$
    ).pipe(
      map(([allStocks, watchlistBySymbol]) =>
        allStocks.filter((s) => !(s.symbol in watchlistBySymbol))
      )
    );

    this.symbol$ = this.stocks$.pipe(
      map((stocks) => {
        const current = stocks.find((s) => s.symbol == this.symbol);
        if (current) return current.symbol;
        if (stocks.length > 0) return stocks[0].symbol;
        return null;
      }),
      bindTo(this, 'symbol')
    );
    this.hasMore$ = this.stocks$.pipe(map((stocks) => stocks.length > 0));
  }

  ngOnDestroy() {
    this.dispose$.dispose();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.watchlist && changes.watchlist.currentValue != undefined) {
      setTimeout(() => {
        this.watchlistBySymbolSubject$.next(groupBy1(this.watchlist, (w) => w.symbol));
      });
    }
  }

  show() {
    // how to avoid it without class inheritance?
    this.popup.show();
  }

  onAddClick() {
    this.popup.hide();
    this.added.emit(this.symbol);
  }
}

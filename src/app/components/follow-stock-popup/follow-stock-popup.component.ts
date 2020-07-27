import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, shareReplay, publishReplay, takeUntil } from 'rxjs/operators';

import { Stock, StockSymbol } from 'src/app/stock';
import { StocksService, WatchlistEntry } from 'src/app/stocks.service';

import { groupBy1 } from 'src/app/utils';
import { connected, DisposerSubject } from 'src/app/rxUtils';

@Component({
  selector: 'app-follow-stock-popup',
  templateUrl: './follow-stock-popup.component.html',
  styleUrls: ['./follow-stock-popup.component.css'],
})
export class FollowStockPopupComponent implements OnInit, OnDestroy, OnChanges {
  @Input() visible = false;

  symbol: StockSymbol;
  symbol$: Observable<StockSymbol>;
  stocks$: Observable<Stock[]>;

  hasMore$: Observable<boolean>;

  private dispose$ = new DisposerSubject();

  private watchlistBySymbolSubject$ = new Subject<{
    [key: string]: WatchlistEntry;
  }>();

  @Input() watchlist: WatchlistEntry[];

  @Output() added = new EventEmitter<StockSymbol>();

  constructor(private stockService: StocksService) {
    this.stocks$ = combineLatest(
      this.stockService.getStocks().pipe(shareReplay(1)),
      this.watchlistBySymbolSubject$.pipe(
        this.dispose$.own(),
        publishReplay(1),
        connected()
      )
    ).pipe(
      map(([allStocks, watchlistBySymbol]) =>
        allStocks.filter((s) => !(s.symbol in watchlistBySymbol))
      )
    );
    this.symbol$ = this.stocks$.pipe(
      map((stocks) => (stocks.length > 0 && stocks[0].symbol) || null),
    );
    this.hasMore$ = this.stocks$.pipe(map((stocks) => stocks.length > 0));
  }

  ngOnInit(): void {
    this.symbol$
      .pipe(takeUntil(this.dispose$))
      .subscribe((symbol) => (this.symbol = symbol));
  }

  ngOnDestroy() {
    this.dispose$.dispose();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.watchlist && changes.watchlist.currentValue != undefined) {
      setTimeout(() => {
        this.watchlistBySymbolSubject$.next(
          groupBy1(this.watchlist, (w) => w.symbol)
        );
      });
    }
  }

  onAddClick() {
    this.visible = false;
    this.added.emit(this.symbol);
  }
}

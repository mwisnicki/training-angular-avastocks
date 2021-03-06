import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, concat } from 'rxjs';
import { takeUntil, finalize, share, retry } from 'rxjs/operators';
import { Client } from '@hapi/nes/lib/client';

import { API_BASE_URL, WS_URL, HTTP_OPTIONS } from '../common';
import { Stock, StockTick, StockSymbol, StockPriceHistory } from '../models/stock';

@Injectable({
  providedIn: 'root',
})
export class StocksService implements OnDestroy {
  httpOptions = HTTP_OPTIONS;

  // TODO add at least minimal caching (debounce)

  private dispose$ = new Subject<void>();

  private nesClient = new Client(WS_URL);

  constructor(private http: HttpClient) {
    this.initWebSocketClient();
    this.stocks$ = this.http.get<Stock[]>(`${API_BASE_URL}/stocks`).pipe(share());
  }

  initWebSocketClient() {
    console.log('connecting websocket');
    // not awaiting connection is ok - requests are queued internally
    this.nesClient.connect();
  }

  ngOnDestroy() {
    this.nesClient.disconnect();
    this.dispose$.next();
    this.dispose$.complete();
  }

  // no sharing: 15 req
  // share(): 2 req (FollowStockPopup.symbol$, BuySellPopupComponent <option>)
  stocks$: Observable<Stock[]>;

  getStocks(): Observable<Stock[]> {
    return this.stocks$;
  }

  getTick(symbol: StockSymbol): Observable<StockTick> {
    const liveSubject = new Subject<StockTick>();

    const path = `/livestream/${symbol}`;
    const handler: Client.Handler = (msg) => liveSubject.next(msg);

    this.nesClient.subscribe(path, handler);

    // TODO get from lastTick instead
    const initial = this.http
      .get<StockTick>(`${API_BASE_URL}/stocks/${symbol}/price`)
      .pipe(retry(3));

    const live = liveSubject.pipe(
      finalize(() => {
        this.nesClient.unsubscribe(path, handler);
      })
    );

    // TODO broken - live will be closed by first takeUntil - perhaps swithMap or custom op?
    //return concat(initial.pipe(takeUntil(live)), live).pipe(share(), takeUntil(this.dispose$));

    return concat(initial, live).pipe(share(), takeUntil(this.dispose$));
  }

  /** Price per month and per day */
  getPriceYearly(symbol: StockSymbol) {
    return this.http.get<StockPriceHistory>(`${API_BASE_URL}/stocks/${symbol}/price/yearly`);
  }

  /** Price per hour and per 5min */
  getPriceToday(symbol: StockSymbol) {
    return this.http.get<StockPriceHistory>(`${API_BASE_URL}/stocks/${symbol}/price/today`);
  }
}

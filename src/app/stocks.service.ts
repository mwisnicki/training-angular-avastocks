import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, concat } from 'rxjs';
import { takeUntil, finalize, share, retry } from 'rxjs/operators';
import { Client } from '@hapi/nes/lib/client';

import { API_BASE_URL, WS_URL, HTTP_OPTIONS } from './common';
import { Stock, StockTick, StockSymbol } from './stock';
import { ISODateString } from './transaction.service';

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

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${API_BASE_URL}/stocks`);
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

export interface StockPricePoint {
  date: ISODateString;
  price: number;
}

export interface StockPriceHistory {
  /** per month for yearly and per hour for today */
  aggregated: StockPricePoint[];
  /** per day for yearly and per 5 min for today */
  detailed: StockPricePoint[];
}

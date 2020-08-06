import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, concat } from 'rxjs';
import { takeUntil, finalize, share, retry, map } from 'rxjs/operators';

import { Client } from '@hapi/nes/lib/client';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Stock, StockTick, StockSymbol } from './stock';

@Injectable({
  providedIn: 'root',
})
export class StocksService implements OnDestroy {
  userId = 'marcin.wisnicki';
  apiBaseUrl = 'https://demomocktradingserver.azurewebsites.net';
  wsBaseUrl = this.apiBaseUrl.replace(/^https:/, 'wss:');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      userid: this.userId,
    }),
  };

  private dispose$ = new Subject<void>();

  private nesClient = new Client(this.wsBaseUrl);

  constructor(private http: HttpClient) {
    this.initWebSocketClient();
  }

  initWebSocketClient() {
    const start = async () => {
      console.log('connecting websocket');
      await this.nesClient.connect();
    };
    // FIXME this is not entirely correct - if we don't await it's possible client is not ready in handlers
    start();
  }

  ngOnDestroy() {
    const stop = async () => {
      await this.nesClient.disconnect();
    };
    stop();
    this.dispose$.next();
    this.dispose$.complete();
  }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiBaseUrl + '/stocks');
  }

  getTick(symbol: StockSymbol): Observable<StockTick> {
    const liveSubject = new Subject<StockTick>();

    const path = `/livestream/${symbol}`;
    const handler: Client.Handler = (msg) => liveSubject.next(msg);

    this.nesClient.subscribe(path, handler);

    // TODO get from lastTick instead
    const initial = this.http
      .get<StockTick>(`${this.apiBaseUrl}/stocks/${symbol}/price`)
      .pipe(retry(3));

    const live = liveSubject.pipe(
      finalize(() => { this.nesClient.unsubscribe(path, handler) }),
    );

    // TODO broken - live will be closed by first takeUntil - perhaps swithMap or custom op?
    //return concat(initial.pipe(takeUntil(live)), live).pipe(share(), takeUntil(this.dispose$));
    
    return concat(initial, live).pipe(share(), takeUntil(this.dispose$));
  }

  followStock(symbol: StockSymbol): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}/userdata/watchlist`,
      {
        symbol: symbol,
        action: 'ADD',
      },
      this.httpOptions
    );
  }

  unfollowStock(symbol: StockSymbol): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}/userdata/watchlist`,
      {
        symbol: symbol,
        action: 'REMOVE',
      },
      this.httpOptions
    );
  }

  getUserData(): Observable<UserData> {
    return this.http.get<UserData>(this.apiBaseUrl + '/userdata', this.httpOptions);
  }

  // TODO cache allocations and update on transactions
  getAllocations(): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(this.apiBaseUrl + '/userdata/allocations', this.httpOptions);
  }

  getAllocation(symbol: StockSymbol): Observable<Allocation> {
    return this.getAllocations().pipe(map((as) => as.find((a) => a.symbol == symbol)));
  }

  addTransaction(symbol: StockSymbol, amount: number) {
    return this.http.post<TransactionRequest>(
      `${this.apiBaseUrl}/transactions`,
      {
        symbol,
        amount: Math.abs(amount),
        side: amount >= 0 ? 'BUY' : 'SELL',
      },
      this.httpOptions
    );
  }

  handleError<T>(op, result: T): (any) => Observable<T> {
    return (error) => {
      console.error(`error`, op, error);
      return of(result);
    };
  }
}

export interface UserData {
  userId: string;
  liquidity: number;
  allocations: Allocation[];
  watchList: WatchlistEntry[];
}

export interface Allocation {
  symbol: string;
  amount: number;
}

export interface WatchlistEntry {
  symbol: string;
}

export interface TransactionRequest {
  symbol: StockSymbol;
  side: 'BUY' | 'SELL';
  amount: number;
}

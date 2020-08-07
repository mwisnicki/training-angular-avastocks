import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, concat } from 'rxjs';
import { takeUntil, finalize, share, retry } from 'rxjs/operators';
import { Client } from '@hapi/nes/lib/client';

import { API_BASE_URL, WS_URL, HTTP_OPTIONS } from './common';
import { Stock, StockTick, StockSymbol } from './stock';

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
    const start = async () => {
      console.log('connecting websocket');
      await this.nesClient.connect();
    };
    // FIXME possible race. There's no clean solution to async init but angular#23279 has some workarounds
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
}

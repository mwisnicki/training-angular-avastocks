import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Stock, StockTick, StockSymbol } from './stock';

@Injectable({
  providedIn: 'root',
})
export class StocksService {
  userId = 'marcin.wisnicki';
  apiBaseUrl = 'https://demomocktradingserver.azurewebsites.net';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      userid: this.userId,
    }),
  };

  constructor(private http: HttpClient) {}

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiBaseUrl + '/stocks');
  }

  getTick(symbol: StockSymbol): Observable<StockTick> {
    // TODO replace with websocket
    return this.http.get<StockTick>(
      `${this.apiBaseUrl}/stocks/${symbol}/price`
    );
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
    return this.http.get<UserData>(
      this.apiBaseUrl + '/userdata',
      this.httpOptions
    );
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

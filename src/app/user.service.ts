import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { API_BASE_URL, HTTP_OPTIONS } from './common';
import { StockSymbol } from './stock';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpOptions = HTTP_OPTIONS;

  constructor(private http: HttpClient, private transactionService: TransactionService) {
    this.transactionService.fetchTransactions$.subscribe(() => this.fetchAllocations$.next());
  }

  followStock(symbol: StockSymbol): Observable<any> {
    return this.http.post(
      `${API_BASE_URL}/userdata/watchlist`,
      {
        symbol: symbol,
        action: 'ADD',
      },
      this.httpOptions
    );
  }

  unfollowStock(symbol: StockSymbol): Observable<any> {
    return this.http.post(
      `${API_BASE_URL}/userdata/watchlist`,
      {
        symbol: symbol,
        action: 'REMOVE',
      },
      this.httpOptions
    );
  }

  getUserData(): Observable<UserData> {
    return this.http.get<UserData>(`${API_BASE_URL}/userdata`, this.httpOptions);
  }

  fetchAllocations$ = new BehaviorSubject<void>(undefined);

  // TODO cache allocations and update on transactions
  fetchAllocations(): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(`${API_BASE_URL}/userdata/allocations`, this.httpOptions);
  }

  getAllocations(): Observable<Allocation[]> {
    return this.fetchAllocations$.pipe(switchMap(() => this.fetchAllocations()));
  }

  getAllocation(symbol: StockSymbol): Observable<Allocation> {
    return this.getAllocations().pipe(map((as) => as.find((a) => a.symbol == symbol)));
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

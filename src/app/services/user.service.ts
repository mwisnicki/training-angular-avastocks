import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map, share } from 'rxjs/operators';

import { API_BASE_URL, HTTP_OPTIONS } from '../common';
import { StockSymbol } from '../models/stock';
import { Allocation, UserData } from '../models/user';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpOptions = HTTP_OPTIONS;

  constructor(private http: HttpClient, private transactionService: TransactionService) {
    this.userData$ = this.http
      .get<UserData>(`${API_BASE_URL}/userdata`, this.httpOptions)
      .pipe(share());
    this.allocations$ = this.http
      .get<Allocation[]>(`${API_BASE_URL}/userdata/allocations`, this.httpOptions)
      .pipe(share());
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

  userData$: Observable<UserData>;

  getUserData(): Observable<UserData> {
    return this.userData$;
  }

  fetchAllocations$ = new BehaviorSubject<void>(undefined);

  // TODO cache allocations and update on transactions
  allocations$: Observable<Allocation[]>;

  getAllocations(): Observable<Allocation[]> {
    return this.fetchAllocations$.pipe(switchMap(() => this.allocations$));
  }

  getAllocation(symbol: StockSymbol): Observable<Allocation> {
    return this.getAllocations().pipe(map((as) => as.find((a) => a.symbol == symbol)));
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap, share } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { API_BASE_URL, HTTP_OPTIONS } from '../common';
import { StockSymbol } from '../models/stock';
import { Transaction, TransactionSide, TransactionResponse } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private httpOptions = HTTP_OPTIONS;

  constructor(private http: HttpClient) {
    this.transactions$ = this.http
      .get<Transaction[]>(`${API_BASE_URL}/transactions`, this.httpOptions)
      .pipe(share());
  }

  fetchTransactions$ = new BehaviorSubject<void>(undefined);

  addTransaction(symbol: StockSymbol, amount: number, side: TransactionSide) {
    const transaction = { symbol, amount, side };
    return this.http
      .post<TransactionResponse>(`${API_BASE_URL}/transactions`, transaction, this.httpOptions)
      .pipe(
        tap({
          complete: () => {
            // TODO instead of invalidation we should just add new entry to cache - POST response has it
            this.fetchTransactions$.next();
          },
        })
      );
  }

  transactions$: Observable<Transaction[]>;

  getTransactions(): Observable<Transaction[]> {
    return this.fetchTransactions$.pipe(switchMap(() => this.transactions$));
  }
}

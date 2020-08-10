import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap, share } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { API_BASE_URL, HTTP_OPTIONS } from './common';
import { StockSymbol } from './stock';
import { Allocation } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private httpOptions = HTTP_OPTIONS;

  constructor(private http: HttpClient) {}

  fetchTransactions$ = new BehaviorSubject<void>(undefined);

  addTransaction(symbol: StockSymbol, amount: number) {
    const transaction = {
      symbol,
      amount: Math.abs(amount),
      side: amount >= 0 ? 'BUY' : 'SELL',
    };
    return this.http
      .post<TransactionRequest>(`${API_BASE_URL}/transactions`, transaction, this.httpOptions)
      .pipe(
        tap({
          complete: () => {
            // TODO instead of invalidation we should just add new entry to cache - POST response has it
            this.fetchTransactions$.next();
          },
        })
      );
  }

  transactions$ = this.http
    .get<Transaction[]>(`${API_BASE_URL}/transactions`, this.httpOptions)
    .pipe(share());

  getTransactions(): Observable<Transaction[]> {
    return this.fetchTransactions$.pipe(switchMap(() => this.transactions$));
  }
}

export type TransactionSide = 'BUY' | 'SELL';

export interface TransactionRequest extends Allocation {
  side: TransactionSide;
}

export type ISODateString = string;

export interface Transaction extends TransactionRequest {
  tickPrice: number;
  cost: number;
  date: ISODateString;
}

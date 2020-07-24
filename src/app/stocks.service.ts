import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Stock } from './stock';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  apiBaseUrl = 'https://demomocktradingserver.azurewebsites.net';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiBaseUrl + '/stocks');
  }

  handleError<T>(op, result: T): (any) => Observable<T> {
    return error => {
      console.error(`error`, op, error);
      return of(result);
    }
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Stock } from './stock';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  userId = 'marcin.wisnicki';
  apiBaseUrl = 'https://demomocktradingserver.azurewebsites.net';
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      userid: this.userId
    }),
  };

  constructor(private http: HttpClient) { }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiBaseUrl + '/stocks');
  }

  getUserData(): Observable<UserData> {
    return this.http.get<UserData>(this.apiBaseUrl + '/userdata', this.httpOptions);
  }

  handleError<T>(op, result: T): (any) => Observable<T> {
    return error => {
      console.error(`error`, op, error);
      return of(result);
    }
  }
}

export interface UserData {
  userId
}
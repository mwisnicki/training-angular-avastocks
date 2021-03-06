import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockSymbol } from '../models/stock';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  selectedSymbol$ = new BehaviorSubject<StockSymbol>('ACME');

  constructor() {}
}

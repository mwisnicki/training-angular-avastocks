import { ISODateString } from '../utils';

export interface Stock {
  name: string;
  symbol: StockSymbol;
  lastTick: StockTick;
}

export type StockSymbol = string;

export interface StockTick {
  stock: StockSymbol; // symbol
  price: number;
  date: string; // 2020-07-24T15:36:14.226Z
}

export interface StockPricePoint {
  date: ISODateString;
  price: number;
}

export interface StockPriceHistory {
  /** per month for yearly and per hour for today */
  aggregated: StockPricePoint[];
  /** per day for yearly and per 5 min for today */
  detailed: StockPricePoint[];
}

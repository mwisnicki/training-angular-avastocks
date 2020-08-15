import { ISODateString } from '../utils';

export interface Stock {
  name: string;
  symbol: StockSymbol;
  lastTick: StockTick;
}

export type StockSymbol = string;

export interface StockTick {
  stock: StockSymbol;
  price: number;
  date: ISODateString;
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

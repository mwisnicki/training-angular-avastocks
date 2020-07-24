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

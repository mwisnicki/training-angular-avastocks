export interface Stock {
  name: string;
  symbol: string;
  lastTick: StockTick;
}

export interface StockTick {
  stock: string; // symbol
  price: number;
  date: string; // 2020-07-24T15:36:14.226Z
}

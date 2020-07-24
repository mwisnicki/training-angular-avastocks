export interface Stock {
  name: string;
  symbol: string;
  lastTick: {
    stock: string;
    price: number;
    date: string;
  };
}

import { Allocation, WatchlistEntry } from './user';
import { ISODateString } from '../utils';

export type TransactionSide = 'BUY' | 'SELL';

export interface TransactionRequest extends Allocation {
  side: TransactionSide;
}

export interface TransactionResponse {
  allocations: Allocation[];
  liquidity: number;
  transaction: Transaction;
  userId: string;
  watchList: WatchlistEntry[];
}

export interface Transaction extends TransactionRequest {
  tickPrice: number;
  cost: number;
  date: ISODateString;
}

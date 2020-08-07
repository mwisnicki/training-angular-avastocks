import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StockSymbol } from 'src/app/stock';
import { Transaction, TransactionService } from 'src/app/transaction.service';

const dateFormatter = ({ value }) => formatDate(value, 'short', 'en-US');
const usdFormatter = ({ value }) => formatCurrency(value, 'en-US', '$');

const directionToCssClass = {
  BUY: 'stock-transactions__grid-cell-buy',
  SELL: 'stock-transactions__grid-cell-sell',
};

interface TransactionRowData extends Transaction {
  dateObject: Date;
}

@Component({
  selector: 'app-transaction-grid',
  templateUrl: './transaction-grid.component.html',
  styleUrls: ['./transaction-grid.component.css'],
})
export class TransactionGridComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid: AgGridAngular;

  columnDefs = [
    {
      headerName: 'Date',
      field: 'dateObject',
      valueFormatter: dateFormatter,
      sort: { direction: 'desc' },
    },
    { headerName: 'Stock', field: 'symbol', filter: true },
    { headerName: 'Amount', field: 'amount', type: 'numericColumn' },
    {
      headerName: 'Direction',
      field: 'side',
      cellClass: ({ value }) => directionToCssClass[value],
    },
    {
      headerName: 'Price',
      field: 'tickPrice',
      type: 'numericColumn',
      valueFormatter: usdFormatter,
    },
    {
      headerName: 'Total',
      field: 'cost',
      type: 'numericColumn',
      valueFormatter: usdFormatter,
    },
  ];

  @Input()
  filterSymbol?: StockSymbol;

  rowData: TransactionRowData[];
  rowData$: Observable<TransactionRowData[]>;

  constructor(private transactionService: TransactionService) {
    const toRow = (tx: Transaction) => ({ ...tx, dateObject: new Date(tx.date) });
    const toRows = (txs: Transaction[]) =>
      txs.filter((tx) => this.isTransactionVisible(tx)).map(toRow);
    this.rowData$ = this.transactionService.getTransactions().pipe(map(toRows));
  }

  ngOnInit(): void {
    this.rowData$.subscribe((rd) => (this.rowData = rd));
  }

  onGridReady() {
    // FIXME it does not fit
    //this.agGrid.api.sizeColumnsToFit();
  }

  isTransactionVisible(tx: Transaction) {
    if (this.filterSymbol) return tx.symbol == this.filterSymbol;
    return true;
  }
}

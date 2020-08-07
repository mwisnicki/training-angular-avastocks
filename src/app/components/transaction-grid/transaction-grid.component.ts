import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { formatCurrency, formatDate } from '@angular/common';
import { StocksService, Transaction } from 'src/app/stocks.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockSymbol } from 'src/app/stock';

const dateFormatter = ({ value }) => formatDate(value, 'short', 'en-US');
const usdFormatter = ({ value }) => formatCurrency(value, 'en-US', '$');

const directionToClass = {
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
    { headerName: 'Stock', field: 'symbol' },
    { headerName: 'Amount', field: 'amount', type: 'numericColumn' },
    { headerName: 'Direction', field: 'side', cellClass: ({ value }) => directionToClass[value] },
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

  // TODO implement that
  @Input()
  filterSymbol?: StockSymbol;

  rowData: TransactionRowData[];
  rowData$: Observable<TransactionRowData[]>;

  constructor(private stockService: StocksService) {
    const toRow = (tx: Transaction) => ({ ...tx, dateObject: new Date(tx.date) });
    this.rowData$ = this.stockService.getTransactions().pipe(map((txs) => txs.map(toRow)));
  }

  ngOnInit(): void {
    this.rowData$.subscribe((rd) => (this.rowData = rd));
  }

  onGridReady() {
    // FIXME it does not fit
    //this.agGrid.api.sizeColumnsToFit();
  }
}

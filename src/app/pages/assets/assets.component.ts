import { Component, OnInit, ViewChild } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';

import { StockSymbol } from 'src/app/models/stock';
import { groupBy1 } from 'src/app/utils';
import { BuySellPopupComponent } from 'src/app/components/buy-sell-popup/buy-sell-popup.component';
import { StocksService } from 'src/app/services/stocks.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { Allocation } from 'src/app/models/user';

const usdFormatter = ({ value }) => formatCurrency(value, 'en-US', '$');

interface AssetRowData extends Allocation {
  price: number;
  total: number;
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
})
export class AssetsComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid: AgGridAngular;

  @ViewChild('sellPopup') sellPopup: BuySellPopupComponent;

  columnDefs = [
    { headerName: 'Stock', field: 'symbol' },
    { headerName: 'Amount', field: 'amount', type: 'numericColumn' },
    {
      headerName: 'Current Price',
      field: 'price',
      type: 'numericColumn',
      valueFormatter: usdFormatter,
    },
    {
      headerName: 'Total',
      field: 'total',
      type: 'numericColumn',
      valueFormatter: usdFormatter,
    },
    { headerName: 'Sell', cellRendererFramework: AssetSellCellRenderer },
  ];

  rowData$: Observable<AssetRowData[]>;

  constructor(
    private stockService: StocksService,
    private userService: UserService,
    private transactionService: TransactionService
  ) {
    this.rowData$ = this.fetchRowData();
  }

  ngOnInit(): void {}

  onGridReady() {
    this.agGrid.api.sizeColumnsToFit();
  }

  private fetchRowData(): Observable<AssetRowData[]> {
    return combineLatest([this.userService.getAllocations(), this.stockService.getStocks()]).pipe(
      map(([allocations, stocks]) => {
        const stockBySymbol = groupBy1(stocks, (s) => s.symbol);
        return allocations.map((a) => {
          const stock = stockBySymbol[a.symbol];
          const price = stock.lastTick.price;
          const rowData = {
            ...a,
            price,
            total: a.amount * price,
          };
          return rowData;
        });
      })
    );
  }

  sell(symbol, amount) {
    this.transactionService.addTransaction(symbol, amount, 'SELL').subscribe();
  }
}

@Component({
  selector: 'app-assets-sell-cell',
  // TODO *ngIf="amount > 0" in cell template does not work
  template: `<div class="stock-list__grid-cell">
    <a (click)="askSell()"><span class="btn-transaction btn-transaction--sell">sell</span></a>
  </div>`,
})
export class AssetSellCellRenderer implements ICellRendererAngularComp {
  symbol: StockSymbol;
  amount: number;

  constructor(private parent: AssetsComponent) {}

  agInit(params: { data: AssetRowData }): void {
    this.symbol = params.data.symbol;
    this.amount = params.data.amount;
  }

  refresh(): boolean {
    return false;
  }

  askSell() {
    this.parent.sellPopup.show(this.symbol, this.amount);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { StocksService, Allocation } from 'src/app/stocks.service';
import { combineLatest, Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { groupBy1 } from 'src/app/utils';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { StockSymbol } from 'src/app/stock';
import { BuySellPopupComponent } from 'src/app/components/buy-sell-popup/buy-sell-popup.component';

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

function formatCurrency({ value }) {
  return usdFormat.format(value);
}

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
      valueFormatter: formatCurrency,
    },
    {
      headerName: 'Total',
      field: 'total',
      type: 'numericColumn',
      valueFormatter: formatCurrency,
    },
    { headerName: 'Sell', cellRendererFramework: AssetSellCellRenderer },
  ];

  private reload$ = new BehaviorSubject<void>(undefined);
  rowData$ = this.reload$.pipe(switchMap(() => this.fetchRowData()));

  constructor(private stockService: StocksService) {}

  ngOnInit(): void {}

  onGridReady() {
    this.agGrid.api.sizeColumnsToFit();
  }

  private fetchRowData(): Observable<AssetRowData[]> {
    return combineLatest([this.stockService.getAllocations(), this.stockService.getStocks()]).pipe(
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
    this.stockService.addTransaction(symbol, -1 * amount).subscribe(() => this.reload$.next());
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';

import { HighchartsChartModule } from 'highcharts-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { DetailsComponent } from './pages/details/details.component';

import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { FollowStocksComponent } from './components/follow-stocks/follow-stocks.component';
import { FollowStockPopupComponent } from './components/follow-stock-popup/follow-stock-popup.component';
import { BuySellPopupComponent } from './components/buy-sell-popup/buy-sell-popup.component';
import { StockGraphComponent } from './components/stock-graph/stock-graph.component';
import { TransactionGridComponent } from './components/transaction-grid/transaction-grid.component';
import { SimpleTickerComponent } from './components/simple-ticker/simple-ticker.component';
import { PopupComponent } from './components/popup/popup.component';

import { TemplatedCellRenderer, AppAgGridCellRenderer } from './agGridUtils'
import { httpInterceptorProviders } from './auth-interceptor'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AssetsComponent,
    TemplatedCellRenderer,
    DetailsComponent,
    StockDetailsComponent,
    FollowStocksComponent,
    FollowStockPopupComponent,
    BuySellPopupComponent,
    StockGraphComponent,
    TransactionGridComponent,
    SimpleTickerComponent,
    PopupComponent,
    AppAgGridCellRenderer,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    HighchartsChartModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

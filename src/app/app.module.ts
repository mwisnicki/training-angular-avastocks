import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AssetsComponent } from './assets/assets.component';
import { DetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { FollowStocksComponent } from './follow-stocks/follow-stocks.component';
import { FollowStockPopupComponent } from './follow-stock-popup/follow-stock-popup.component';
import { BuySellPopupComponent } from './buy-sell-popup/buy-sell-popup.component';
import { StockGraphComponent } from './stock-graph/stock-graph.component';
import { TransactionGridComponent } from './transaction-grid/transaction-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AssetsComponent,
    DetailsComponent,
    StockDetailsComponent,
    FollowStocksComponent,
    FollowStockPopupComponent,
    BuySellPopupComponent,
    StockGraphComponent,
    TransactionGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

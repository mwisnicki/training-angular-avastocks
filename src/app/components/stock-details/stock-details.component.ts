import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { StockSymbol } from 'src/app/stock';
import { AppComponent } from 'src/app/app.component';
import { TransactionService } from 'src/app/transaction.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css'],
})
export class StockDetailsComponent implements OnInit {
  @Input() symbol: StockSymbol;
  @Input() showUnfollow: boolean = true;

  @Output() unfollow = new EventEmitter<StockSymbol>();

  amount: number;

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.userService.getAllocation(this.symbol).subscribe((allocation) => {
      this.amount = allocation?.amount;
    });
  }

  onSymbolClicked() {
    this.app.selectedSymbol$.next(this.symbol);
  }

  buy(symbol: StockSymbol, amount: number) {
    console.log('buy', ...arguments);
    this.addTransaction(symbol, amount);
  }

  sell(symbol: StockSymbol, amount: number) {
    this.addTransaction(symbol, -amount);
  }

  private addTransaction(symbol: StockSymbol, amount: number) {
    this.transactionService.addTransaction(symbol, amount).subscribe(() => {
      const safeAmount = Math.max(0, (this.amount || 0) + amount);
      this.amount = safeAmount;
    });
  }
}

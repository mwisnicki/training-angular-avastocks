import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StockSymbol } from 'src/app/models/stock';
import { TransactionService } from 'src/app/services/transaction.service';
import { AppService } from 'src/app/services/app.service';
import { TransactionSide } from 'src/app/models/transaction';

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
    this.addTransaction(symbol, amount, 'BUY');
  }

  sell(symbol: StockSymbol, amount: number) {
    this.addTransaction(symbol, amount, 'SELL');
  }

  private addTransaction(symbol: StockSymbol, amount: number, side: TransactionSide) {
    this.transactionService.addTransaction(symbol, amount, side).subscribe((result) => {
      const allocation = result.allocations.find((i) => i.symbol == symbol);
      this.amount = allocation?.amount;
    });
  }
}

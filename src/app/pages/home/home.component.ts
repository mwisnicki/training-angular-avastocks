import { Component, OnInit } from '@angular/core';
import { StockSymbol } from 'src/app/models/stock';
import { AppService } from 'src/app/services/app.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedSymbol$: Observable<StockSymbol>;

  constructor(private app: AppService) {
    this.selectedSymbol$ = this.app.selectedSymbol$;
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  selectedSymbol: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('symbol')) {
        this.selectedSymbol = params.get('symbol').toUpperCase();
      } else {
        this.router.navigateByUrl('details/aapl');
      }
    });
  }
}

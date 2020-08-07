import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { StockSymbol } from 'src/app/stock';
import { StocksService } from 'src/app/stocks.service';

const PERIODS = ['today', 'yearly'] as const;

@Component({
  selector: 'app-stock-graph',
  templateUrl: './stock-graph.component.html',
  styleUrls: ['./stock-graph.component.css'],
})
export class StockGraphComponent implements OnInit, OnChanges {
  @Input() symbol: StockSymbol;

  @Input() showDetailsButton = true;

  periods = PERIODS;

  @Input() period: typeof PERIODS[number] = 'today';

  updateFlag = false;
  chart: Highcharts.Chart;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: null,
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Price',
      },
    },
    series: [
      {
        name: 'detailed',
        type: 'line',
        data: [],
      },
      {
        name: 'aggregated',
        type: 'line',
        data: [],
      },
    ],
  };

  constructor(private stockService: StocksService) {}

  chartCallback(chart) {
    this.chart = chart;
    // doesn't really help
    chart.reflow();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.symbol) {
      this.refreshPrices();
    }
  }

  onPeriodChanged() {
    this.refreshPrices();
  }

  fetchPrices() {
    switch (this.period) {
      case 'today':
        return this.stockService.getPriceToday(this.symbol);
      case 'yearly':
        return this.stockService.getPriceYearly(this.symbol);
    }
  }

  refreshPrices() {
    this.fetchPrices().subscribe((history) => {
      this.chartOptions.series = [
        {
          name: 'detailed',
          type: 'line',
          data: history.detailed.map((p) => [Date.parse(p.date), p.price]),
        },
        {
          name: 'aggregated',
          type: 'line',
          data: history.aggregated.map((p) => [Date.parse(p.date), p.price]),
        },
      ];
      console.log('series', this.chartOptions.series);
      this.updateFlag = true;
    });
  }
}

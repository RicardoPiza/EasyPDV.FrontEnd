import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-sold-products-dashboard',
  templateUrl: './sold-products-dashboard.component.html',
  styleUrls: ['./sold-products-dashboard.component.css']
})
export class SoldProductsDashboardComponent {
  private productsChart!: any;
  public chartColor: any;
  buildChart(data: any) {

    const ctx = document.getElementById('productsChart') as HTMLCanvasElement;
    this.chartColor = "#FFFFFF";
    this.productsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((x: any) => x.productName),
        datasets: [{
          label: data.map((x: any) => x.productName),
          data: data.map((x: any) => x.quantitySold),
          backgroundColor: data.map((x: any) => x.barColor),
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  destroy() {
    if (this.productsChart)
      this.productsChart.destroy();
  }
}

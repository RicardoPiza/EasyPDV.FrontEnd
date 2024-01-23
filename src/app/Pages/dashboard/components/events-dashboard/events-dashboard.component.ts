import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.css']
})
export class EventsDashboardComponent {
  private eventsChart!: Chart;
  public chartColor: any;
  buildChart(data: any) {

    const ctx = document.getElementById('eventsChart') as HTMLCanvasElement;
    this.chartColor = "#FFFFFF";
    this.eventsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((x: any) => x.name),
        datasets: [{
          label: 'Eventos realizados',
          data: data.map((x: any) => x.totalProfit),
          backgroundColor: data.map((x: any) => x.barColor),
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          }
        },

      }
    });
  }
  destroy() {
    if (this.eventsChart)
      this.eventsChart.destroy();
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@auth0/auth0-angular';
import { Chart } from 'chart.js/auto';
import { EventService } from 'src/app/@core/services/event.service';
import { SaleService } from 'src/app/@core/services/sale.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit {
  public chartColor: any;
  public chartEmail: any;
  public chartHours: any;
  public chartData: any = [];
  public formEvent!: UntypedFormGroup;
  public accountName: any;
  public dataSource: any;
  public displayedColumns: string[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('TABLE') table!: ElementRef;

  constructor(
    private saleService: SaleService,
    public formBuilder: UntypedFormBuilder,
    private eventService: EventService,
    public authService: AuthService
  ) {
    this.authService.user$.subscribe(user => {
      this.accountName = user?.name;
    });
  }
  
  ngOnInit() {

    this.formEvent = this.formBuilder.group({
      id: ['00000000-0000-0000-0000-000000000000'],
      name: [''],
      cashierStatus: [],
      balance: [0],
      sales: [[]],
      date: [Date],
      duration: [0],
      responsible: ['']
    });

    this.getEvent();

  }

  getEvent() {
    this.eventService.getEvent(this.accountName).subscribe(_response => {
      if (_response) {
        this.formEvent.patchValue(_response.data.result);
        this.saleService.getReport(_response.data.result).subscribe(response => {
          this.dataSource = new MatTableDataSource<PeriodicElement>(response.data);
          this.dataSource.paginator = this.paginator;
          this.chartData = response.data;
          this.displayedColumns = ['productName', 'price', 'quantitySold', 'saleTotal']
          this.buildChart();
        });
      }
    });
  }
  buildChart() {
    this.chartColor = "#FFFFFF";
    const ctx: any = document.getElementById('productsChart');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.chartData.map((x: any) => x.productName),
        datasets: [{
          label: this.chartData.map((x: any) => x.productName),
          data: this.chartData.map((x: any) => x.quantitySold),
          backgroundColor: this.chartData.map((x: any) => x.barColor),
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
  exportAsExcel()
    {
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Vendas por produtos');

      /* save to file */
      XLSX.writeFile(wb, `${this.formEvent.value.name} ${this.formEvent.value.date}.xlsx`);

    }
}

export interface PeriodicElement {
  productName: any;
  price: any;
  quantitySold: any;
  saleTotal: any;
}
import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@auth0/auth0-angular';
import { Chart } from 'chart.js/auto';
import { EventService } from 'src/app/@core/services/event.service';
import { SaleService } from 'src/app/@core/services/sale.service';
import { LoaderService } from 'src/app/@core/shared/services/loader.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit, AfterViewInit {
  public chartColor: any;
  public chartEmail: any;
  public chartHours: any;
  public chartData: any = [];
  public eventChartData: any = [];
  public formEvent!: UntypedFormGroup;
  public accountName: any;
  public dataSource: any;
  public eventDataSource: any;
  public displayedColumns: string[] = [];
  public eventDisplayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('TABLE') table!: ElementRef;
  @ViewChild('EVENTTABLE') eventTable!: ElementRef;
  public pageVisibility: boolean = true;

  constructor(
    private saleService: SaleService,
    public formBuilder: UntypedFormBuilder,
    private eventService: EventService,
    public authService: AuthService,
    private loadingService: LoaderService,
  ) {
    this.authService.user$.subscribe(user => {
      this.accountName = user?.name;
    });
  }
  ngAfterViewInit(): void {
    this.getEvent();
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

  }

  getEvent() {
    this.eventService.getEvent(this.accountName).subscribe(_response => {
      this.loadingService.setLoading(true);
      if (_response.success) {
        this.formEvent.patchValue(_response.data.result);
        this.saleService.getReport(_response.data.result).subscribe(response => {

          if (response.success) {

            if (response.data.length <= 0) {
              this.pageVisibility = false;
              this.loadingService.setLoading(false);
            } else {
              this.dataSource = new MatTableDataSource<SalesPeriodicElement>(response.data);
              this.dataSource.paginator = this.paginator;
              this.chartData = response.data;
              this.displayedColumns = ['productName', 'price', 'quantitySold', 'saleTotal']
              this.buildChart();
              this.loadingService.setLoading(false);
            }

          } else {
            this.loadingService.setLoading(false);
          }
        });
        this.eventService.getEventReport(_response.data.result).subscribe((_response) => {
          this.eventDisplayedColumns = ['name', 'totalProfit', 'initialBalance', 'duration', 'created']
          this.eventDataSource = new MatTableDataSource<EventPeriodicElement>(_response.data);
          _response.data.forEach((element: any) => {
            element.created = formatDate(element.created, 'dd/MM/yyyy', 'en-US');
          });          
          this.eventChartData = _response.data;
          this.buildEventChart();
          console.log(_response)
        });
      } else {
        this.loadingService.setLoading(false);
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

  buildEventChart() {
    this.chartColor = "#FFFFFF";
    const ctx: any = document.getElementById('eventsChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.eventChartData.map((x: any) => x.name),
        datasets: [{
          label: this.eventChartData.map((x: any) => x.name),
          data: this.eventChartData.map((x: any) => x.totalProfit),
          backgroundColor: this.eventChartData.map((x: any) => x.barColor),
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas por produtos');

    /* save to file */
    XLSX.writeFile(wb, `${this.formEvent.value.name} ${this.formEvent.value.date}.xlsx`);

  }
  exportEventAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.eventTable.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Info. Evento');

    /* save to file */
    XLSX.writeFile(wb, `${this.formEvent.value.name} ${this.formEvent.value.date}.xlsx`);

  }
}
export interface SalesPeriodicElement {
  productName: any;
  price: any;
  quantitySold: any;
  saleTotal: any;
}
export interface EventPeriodicElement {
  name: any;
  totalProfit: any;
  initialBalance: any;
  duration: any;
  created: any;
}
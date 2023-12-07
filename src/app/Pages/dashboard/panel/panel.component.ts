import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
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

export class PanelComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public hasData: boolean = true;
  public isPageLoaded: boolean = true;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;
  public selectedTabIndex = 0;
  private productsChart!: any;
  private eventsChart!: Chart;

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
    this.isPageLoaded = this.loadingService.getLoading();
  }
  ngOnDestroy(): void {
    if (this.formEvent.value.cashierStatus == 0)
      this.sendDuration();
  }
  ngAfterViewInit(): void {
    this.getEvent();
  }

  onLinkClick(event: MatTabChangeEvent) {
    if (event.index <= 0) {
      const ctxProducts = document.getElementById('productsChart') as HTMLCanvasElement;
      this.buildChart(ctxProducts);
    }

    if (event.index == 1) {
      const ctxEvents = document.getElementById('eventsChart') as HTMLCanvasElement;
      this.buildEventChart(ctxEvents);
    }
  }
  ngOnInit() {

    this.formEvent = this.formBuilder.group({
      id: ['00000000-0000-0000-0000-000000000000'],
      name: [''],
      cashierStatus: [0],
      balance: [0],
      sales: [[]],
      date: [Date],
      duration: [''],
      responsible: ['']
    });
    this.selectedTabIndex = 0;

  }

  getEvent() {
    this.eventService.getEvent(this.accountName).subscribe(_response => {
      if (_response.success) {
        let _duration: Array<any> = _response.data.duration.split(":", 3);
        this.hours = parseInt(_duration[0]);
        this.minutes = parseInt(_duration[1]);
        this.seconds = parseInt(_duration[2]);
        this.formEvent.patchValue(_response.data);
        this.saleService.getReport(_response.data.responsible, _response.data.id).subscribe(response => {

          if (response.success) {

            if (response.data.length <= 0) {
              this.hasData = false;
              this.loadingService.setLoading(false);
            } else {
              this.dataSource = new MatTableDataSource<SalesPeriodicElement>(response.data);
              this.dataSource.paginator = this.paginator;
              this.chartData = response.data;
              this.displayedColumns = ['productName', 'price', 'quantitySold', 'saleTotal']
              this.loadingService.setLoading(false);
              if (this.selectedTabIndex == 0) {
                const ctxProducts = document.getElementById('productsChart') as HTMLCanvasElement;
                this.buildChart(ctxProducts);
              } if (this.selectedTabIndex == 1) {
                const ctxEvents = document.getElementById('eventsChart') as HTMLCanvasElement;
                this.buildEventChart(ctxEvents);
              }
            }

          } else {
            this.loadingService.setLoading(false);
          }
        });
        if (_response.data.id != '00000000-0000-0000-0000-000000000000') {
          this.eventService.getEventReport(_response.data.responsible).subscribe((_response) => {
            if (_response.success) {
              this.eventDisplayedColumns = ['name', 'totalProfit', 'initialBalance', 'duration', 'created']
              this.eventDataSource = new MatTableDataSource<EventPeriodicElement>(_response.data);
              _response.data.forEach((element: any) => {
                element.created = formatDate(element.created, 'dd/MM/yyyy', 'en-US');
              });
              this.eventChartData = _response.data;
            }
          });
        } else {
          this.loadingService.setLoading(false);
        }
      } else {
        this.loadingService.setLoading(false);
      }
    });
  }
  buildChart(ctx: any) {

    if (this.productsChart) {
      this.productsChart.destroy();
    }

    if (this.formEvent.value.cashierStatus == 0) {
      this.chartColor = "#FFFFFF";
      this.productsChart = new Chart(ctx, {
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
  }

  buildEventChart(ctx: any) {

    if (this.eventsChart) {
      this.eventsChart.destroy();
    }
    this.chartColor = "#FFFFFF";
    this.eventsChart = new Chart(ctx, {
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
  updateDuration(noNovoTempo: string): void {
    this.formEvent.value.duration = noNovoTempo;
  }
  sendDuration() {
    this.eventService.sendDuration(this.formEvent.value).subscribe(response => {
      if (response.success) {
        this.formEvent.value.duration = response.data
      }
    });
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
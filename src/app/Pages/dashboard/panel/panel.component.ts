import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from '@auth0/auth0-angular';
import { Chart } from 'chart.js/auto';
import { EventService } from 'src/app/@core/services/event.service';
import { SaleService } from 'src/app/@core/services/sale.service';
import { LoaderService } from 'src/app/@core/shared/services/loader.service';
import * as XLSX from 'xlsx';
import { SoldProductsDashboardComponent } from '../components/sold-products-dashboard/sold-products-dashboard.component';
import { EventsDashboardComponent } from '../components/events-dashboard/events-dashboard.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PanelComponent implements OnInit, AfterViewInit, OnDestroy {
  public chartColor: any;
  public chartEmail: any;
  public chartHours: any;
  public chartData: any = [];
  public eventChartData: any = [];
  public saleData: SalePeriodicElement[] = [];
  public formEvent!: UntypedFormGroup;
  public accountName: any;
  public dataSource: any;
  public eventDataSource: any;
  public salesDataSource: any
  public displayedColumns: string[] = [];
  public eventDisplayedColumns: string[] = [];
  public salesDisplayedColumns: string[] = [];
  public innerDisplayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('TABLE') table!: ElementRef;
  @ViewChild('EVENTTABLE') eventTable!: ElementRef;
  @ViewChild('SALESTABLE') salesTable!: ElementRef;
  @ViewChild('productDashboard') productDashboard!: SoldProductsDashboardComponent;
  @ViewChild('eventsDashboard') eventsDashboard!: EventsDashboardComponent;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<SoldProduct>>;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  public hasData: boolean = true;
  public isPageLoaded: boolean = true;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;
  public selectedTabIndex = 0;
  private productsChart!: any;
  public expandedSales?: SalePeriodicElement | null;

  constructor(
    private saleService: SaleService,
    public formBuilder: UntypedFormBuilder,
    private eventService: EventService,
    public authService: AuthService,
    private loadingService: LoaderService,
    private cd: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.accountName = user?.email;
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
      this.productDashboard.destroy()
      this.productDashboard.buildChart(this.chartData);
    }

    if (event.index == 1) {
      this.eventsDashboard.destroy();
      this.eventsDashboard.buildChart(this.eventChartData);
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
        this.saleService.getSoldProductsReport(_response.data.responsible, _response.data.id).subscribe(response => {

          if (response.success) {

            if (response.data.length <= 0) {
              this.hasData = false;
              this.loadingService.setLoading(false);
            } else {
              this.dataSource = new MatTableDataSource<SoldProductsPeriodicElement>(response.data);
              this.dataSource.paginator = this.paginator;
              this.chartData = response.data;
              this.displayedColumns = ['productName', 'price', 'quantitySold', 'saleTotal']
              this.loadingService.setLoading(false);
              if (this.selectedTabIndex == 0) {
                this.productDashboard.buildChart(this.chartData);
              } else if (this.selectedTabIndex == 1) {
                this.eventsDashboard.buildChart(this.eventChartData);
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
              this.displayedColumns = ['productName', 'price', 'quantitySold', 'saleTotal']
              this.eventChartData = _response.data;
            }
          });
        } else {
          this.loadingService.setLoading(false);
        }

        if (_response.data.id != '00000000-0000-0000-0000-000000000000') {
          this.eventService.get(_response.data.id).subscribe((response) => {
            if (response.success) {
              response.data.sales.forEach((element: any) => {
                element.saleDate = formatDate(element.saleDate, 'dd/MM/yyyy', 'en-US');
              });
              this.salesDisplayedColumns = ['id', 'salePrice', 'saleDate', 'paymentMethod', 'print'];
              this.innerDisplayedColumns = ['description', 'id', 'name', 'price', 'productQuantity', 'status', 'stockQuantity', 'print'];

              response.data.sales.forEach((sale: any) => {
                if (sale.soldProducts && Array.isArray(sale.soldProducts) && sale.soldProducts.length) {
                  this.saleData = [...this.saleData, { ...sale, soldProducts: new MatTableDataSource(sale.soldProducts) }];
                } else {
                  this.saleData = [...this.saleData, sale];
                }
              });
              this.salesDataSource = new MatTableDataSource(this.saleData);
              this.salesDataSource.sort = this.sort;
            }
          });
        }
      } else {
        this.loadingService.setLoading(false);
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
  exportSalesAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.salesTable.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Info. vendas');

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
  toggleRow(row: SalePeriodicElement) {
    row.soldProducts && (row.soldProducts as MatTableDataSource<SoldProduct>).data.length ? (this.expandedSales = this.expandedSales === row ? null : row) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<SoldProduct>).sort = this.innerSort.toArray()[index]);
  }
  applyFilter(event: any) {
    let filterValue = event.target.value;
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<SoldProduct>).filter = filterValue.trim().toLowerCase());
  }
  translate(word: string) {
    switch (word) {
      case "description":
        return "Descrição";
      case "id":
        return "Id";
      case "name":
        return "Nome do produto";
      case "price":
        return "Preço";
      case "productQuantity":
        return "Quantidade vendida";
      case "status":
        return "Status";
      case "stockQuantity":
        return "Quantidade em estoque"
      case "salePrice":
        return "Valor da venda"
      case "saleDate":
        return "Data Da Venda"
      case "paymentMethod":
        return "Meio de pagamento"
      default: null
    }
    return null;
  }
  printTickets(value: any) {
    window.print();
    console.log(value)
  }
}
export interface SoldProductsPeriodicElement {
  productName: any;
  price: any;
  quantitySold: any;
  saleTotal: any;
}
export interface SoldProduct {
  description: any;
  id: any;
  name: any;
  price: any;
  productQuantity: any;
  status: any;
  stockQuantity: any;
}
export interface EventPeriodicElement {
  name: any;
  totalProfit: any;
  initialBalance: any;
  duration: any;
  created: any;
}
export interface SalePeriodicElement {
  id: any;
  soldProducts?: SoldProduct[] | MatTableDataSource<SoldProduct>;
  salePrice: any;
  saleDate: any;
  paymentMethod: any;
}


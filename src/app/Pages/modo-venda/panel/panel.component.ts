import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/@core/services/product.service';
import { LoaderService } from 'src/app/@core/shared/services/loader.service';
import { SaleService } from 'src/app/@core/services/sale.service';
import { EventService } from 'src/app/@core/services/event.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy{

  public page = 1;
  public total = 0.0;
  public activeProducts: Array<any> = [];
  public activeChosenProducts: Array<any> = [];
  public closeResult = '';
  public form!: UntypedFormGroup;
  public formProduct!: UntypedFormGroup;
  public formEvent!: UntypedFormGroup;
  public accountName: any;
  public showSuccessToast: boolean = false;
  public eventResult: any;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;


  @Output()
  public data: Array<any> = [];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource;
  public productImage = new FormData();
  constructor(
    private productService: ProductService,
    private eventService: EventService,
    private toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private loadingService: LoaderService,
    private config: NgbModalConfig,
    private saleService: SaleService,
    public authService: AuthService
  ) {
    config.backdrop = 'static';
    this.authService.user$.subscribe(user => {
      this.accountName = user?.name;
    });
  }
  ngOnDestroy(): void {
    this.sendDuration();
  }

  ngAfterViewInit(): void {
    this.getData();
  }
  getData() {

    this.data.splice(0);
    let params = this.getParametros();
    this.productService
      .listProducts(params)
      .subscribe((response) => {
        if (response.success) {
          this.activeProducts = response.data.result.products.filter((x: { status: string; }) => x.status == 'Ativo');
          for (var i = 0; i < this.activeProducts.length; i++) {
            this.data.push({
              id: this.activeProducts[i].id,
              price: this.activeProducts[i].price,
              image: this.activeProducts[i].image,
              name: this.activeProducts[i].name,
              stockQuantity: this.activeProducts[i].stockQuantity,
              status: this.activeProducts[i].status,
              description: this.activeProducts[i].description,
              productQuantity: (<HTMLInputElement>document.getElementById(this.activeProducts[i].id))?.value
            });
            this.form.value.SoldProducts = this.data;
          }

          this.dataSource = new MatTableDataSource<any>(this.data);
          this.loadingService.setLoading(false);
        } else {
          this.loadingService.setLoading(false);

        }
        this.getEvent();
      });
    this.authService.user$.subscribe(user => {
      this.accountName = user?.name;
    });

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: ['00000000-0000-0000-0000-000000000000'],
      SoldProducts: [[]],
      salePrice: [0],
      saleDate: [Date.now],
      paymentMethod: [''],
      saleType: [0],
    });

    this.formProduct = this.formBuilder.group({
      id: ['00000000-0000-0000-0000-000000000000'],
      price: [],
      name: ['', Validators.required],
      stockQuantity: [],
      status: ['', Validators.required],
      description: ['', Validators.required],
      productQuantity: [0]
    });

    this.formEvent = this.formBuilder.group({
      id: ['00000000-0000-0000-0000-000000000000'],
      name: [''],
      cashierStatus: [],
      balance: [0],
      sales: [[]],
      date: [Date],
      duration: [''],
      responsible: ['']
    });
  }
  private getParametros(): any {
    let params = {
      price: 0,
      name: "",
      stockQuantity: 0,
      status: "",
      description: "",
      desc: true,
      orderByColumn: '',
      ownerUserEmail: this.accountName,
      termo: {
        dataField: '',
        value: '',
        operation: ''
      },
    };
    return params;
  }
  submit(): void {
    this.form.value.SalePrice = this.total;
    this.formEvent.value.responsible = this.accountName;
    this.formEvent.value.sales.push(this.form.value);
    this.form.value.SoldProducts = this.activeChosenProducts;
    this.loadingService.setLoading(true);
    this.saleService.postSale(this.formEvent.value)
      .subscribe((result) => {
        if (result.success) {
          let _duration: Array<any> = result.data.duration.split(":", 3);
          this.hours = parseInt(_duration[0]);
          this.minutes = parseInt(_duration[1]);
          this.seconds = parseInt(_duration[2]);
          this.toastr.success('Venda realizada com sucesso');
          this.modalService.dismissAll();
          this.loadingService.setLoading(false);
        } else {
          result.errors.forEach((element: any) => {
            this.toastr.error(element);
          });
          this.loadingService.setLoading(false);
        }
      });
    this.ngOnInit();
    this.ngAfterViewInit();
    this.formProduct.value.productQuantity = 0;
  }
  sumItem(id: any) {
    let element = (<HTMLInputElement>document.getElementById(id));
    if (element.value == "") {
      element.value = '0'
    }
    element.value = (parseInt(element.value) + 1).toString();
  }

  sell(content: any) {
    for (var i = 0; i < this.activeProducts.length; i++) {
      this.data[i].productQuantity = (<HTMLInputElement>document.getElementById(this.activeProducts[i].id))?.value

    }
    this.activeChosenProducts = this.data.filter((x: { productQuantity: number; }) => x.productQuantity > 0);
    this.form.value.SoldProducts = this.data;

    this.saleService.prepareSale(this.activeChosenProducts)
      .subscribe((response) => {
        if (response.success) {
          this.total = response.data.totalSalePrice;
          this.open(content);
          this.loadingService.setLoading(false);
        } else {
          response.errors.forEach((element: any) => {
            this.toastr.error(element);
          });
          this.loadingService.setLoading(false);
        }
      });
    this.loadingService.setLoading(false);
  }
  open(content: any) {

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openStopEvent(content: any) {
    this.getEventResult();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  startEvent() {
    this.formEvent.value.responsible = this.accountName;
    this.formEvent.value.duration = '0';
    this.eventService.startEvent(this.formEvent.value).subscribe(_response => {
      if (_response) {
        this.formEvent.patchValue(_response);
        this.toastr.success('Evento iniciado');
        this.modalService.dismissAll();
        this.ngOnInit();
        this.ngAfterViewInit();
        this.loadingService.setLoading(false);
      }
      else {
        this.toastr.error('Erro ao iniciar o evento');
        this.ngOnInit();
        this.ngAfterViewInit();
        this.loadingService.setLoading(false);
      }
    });
  }
  stopEvent() {
    this.eventService.stopEvent(this.formEvent.value).
      subscribe(response => {
        this.formEvent.patchValue(response);
        this.modalService.dismissAll();
        this.loadingService.setLoading(false);

      });
    this.loadingService.setLoading(false);
  }
  getEvent() {
    this.eventService.getEvent(this.accountName).subscribe(_response => {
      if (_response.success) {
        let _duration: Array<any> = _response.data.duration.split(":", 3);
        this.hours = parseInt(_duration[0]);
        this.minutes = parseInt(_duration[1]);
        this.seconds = parseInt(_duration[2]);
        this.formEvent.patchValue(_response.data);
        this.loadingService.setLoading(false);
      } else {
        this.toastr.error('Evento não encontrado');
        this.loadingService.setLoading(false);
      }
    });
    this.loadingService.setLoading(false);
  }
  getEventResult() {
    this.eventService.getEventResult(this.formEvent.value.id).
      subscribe(_response => {
        this.eventResult = _response.data;
      });
    this.loadingService.setLoading(false);
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  updateDuration(noNovoTempo: string): void {
    this.formEvent.value.duration = noNovoTempo;
  }
  sendDuration(){
    this.eventService.sendDuration(this.formEvent.value).subscribe(response =>{
      if(response.success){
        this.formEvent.value.duration = response.data
      }
    }); 
  }
}

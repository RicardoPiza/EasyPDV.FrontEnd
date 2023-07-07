import { Component, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/@core/services/product.service';
import { LoaderService } from 'src/app/@core/shared/services/loader.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {

  public page = 1;
  public activeProducts: Array<any> = [];
  public closeResult = '';
  public form!: UntypedFormGroup;
  public showSuccessToast: boolean = false;
  @Output()
  public data: Array<any> = [];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource;
  public productImage = new FormData();
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private loadingService: LoaderService,
    private config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
  }

  ngAfterViewInit(): void {
    this.data.splice(0);
    let params = this.getParametros();
    this.loadingService.setLoading(true);
    this.productService
      .listProducts(params)
      .subscribe((response) => {
        if (response.success)
          this.activeProducts = response.data.result.products.filter((x: { status: string; }) => x.status == 'Ativo');
          for (var i = 0; i < this.activeProducts.length; i++) {
            this.data.push(this.activeProducts[i]);
            this.activeProducts[i].image = 'data:image/*;base64,' + this.activeProducts[i].image;
          }

        this.dataSource = new MatTableDataSource<any>(this.data);
        this.loadingService.setLoading(false);
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: ['00000000-0000-0000-0000-000000000000'],
      price: [],
      image: ['', Validators.required],
      name: ['', Validators.required],
      stockQuantity: [],
      status: ['', Validators.required],
      description: ['', Validators.required],
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
      termo: {
        dataField: '',
        value: '',
        operation: ''
      },
    };
    return params;
  }
  sale():void {
    
  }
}

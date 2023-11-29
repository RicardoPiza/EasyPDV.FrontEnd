import { Component, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from 'src/app/@core/services/product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/@core/shared/services/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit, AfterViewInit {

  public page = 1;
  public closeResult = '';
  public form!: UntypedFormGroup;
  public showSuccessToast: boolean = false;
  @Output()
  public data: Array<any> = [];
  public accountName: any;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource;
  public productImage = new FormData();
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private loadingService: LoaderService,
    private config: NgbModalConfig,
    private authService: AuthService
  ) {
    config.backdrop = 'static';
    this.authService.user$.subscribe(user => {
      this.accountName = user?.name;
    });
  }
  ngAfterViewInit(): void {
    this.getData();
  }
  getData(){
    this.data.splice(0);
    let params = this.getParametros();
    this.productService
      .listProducts(params)
      .subscribe((response) => {
        this.loadingService.setLoading(true);
        if (response.success)
          for (var i = 0; i < response.data.result.products.length; i++) {
            this.data.push(response.data.result.products[i]);
            response.data.result.products[i].image = 'data:image/*;base64,' + response.data.result.products[i].image;
          } else{
            this.loadingService.setLoading(false);
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
      status: [''],
      description: ['', Validators.required],
      ownerUserEmail: ['']
    });
    this.form.controls['status'].setValue("Ativo", { onlySelf: true });
  }

  submit(content: any): void {
    this.loadingService.setLoading(true);
    if (this.form.value.id == '00000000-0000-0000-0000-000000000000') {
      this.form.value.ownerUserEmail = this.accountName;
      this.productService.postProduct(this.form.value)
        .subscribe(response => {
          if (response.success) {
            this.form.patchValue(response.data.result);
            this.toastr.success('Produto adicionado com sucesso, Agora, selecione uma imagem');
            this.loadingService.setLoading(false);
            this.modalService.dismissAll();
            this.getProduct(response.data.id, content);
          } else {
            response.errors.forEach((element: any) => {
              this.toastr.error(element);
            });
            this.loadingService.setLoading(false);
            this.modalService.dismissAll();
          }
        });
    } else {
      this.productService.updateProduct(this.form.value)
        .subscribe(response => {
          if (response.success) {
            this.form.patchValue(response.data.result);
            this.ngAfterViewInit();
            this.toastr.success('Produto atualizado com sucesso');
            this.loadingService.setLoading(false);
          } else {
            this.toastr.error('Erro ao atualizar produto');
            this.loadingService.setLoading(false);
          }
        });
    }
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
  remove(id: any) {
    this.loadingService.setLoading(true);
    this.productService.removeProduct(id)
      .subscribe((response) => {
        if (response.success) {
          this.data.splice(response.data.result, 1);
          this.ngOnInit();
          this.ngAfterViewInit();
          this.toastr.warning('Produto excluído');
          this.loadingService.setLoading(false);
        } else {
          this.toastr.error('Erro interno ao excluir produto');
          this.loadingService.setLoading(false);
        }
      });
    this.modalService.dismissAll();
  }


  open(content: any) {
    this.ngOnInit();
    this.ngAfterViewInit();
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
  openImageSelect(content: any) {
    this.ngOnInit();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'm',
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  openConfirmation(content: any) {
    this.ngOnInit();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'm',
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  getProduct(id: any, content: any) {
    this.productService.getById(id)
      .subscribe((response) => {
        this.loadingService.setLoading(true);
        if (response) {
          this.loadingService.setLoading(false);
          this.form.patchValue(response.data);
        } else {
          this.loadingService.setLoading(false);
        }
      });
    this.open(content);
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
  handleFileInput(event: any) {
    this.productImage = new FormData();
    this.loadingService.setLoading(true);
    this.productImage.append('Image', event.target.files[0]);
    this.productService.saveImage(this.productImage, this.form.value.id)
      .subscribe(response => {
        if (response.success) {
          this.toastr.success('Imagem salva');
          this.ngAfterViewInit();
          this.loadingService.setLoading(false);
        } else {
          this.toastr.error('Erro ao salvar a imagem');
          this.loadingService.setLoading(false);
        }
      });
    this.modalService.dismissAll();
  }
}

import { Component, OnInit, Output} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ProductService } from 'src/app/@core/services/product.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit{

  @Output()
  public data: Array<any> = [];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource;
  public columnsToDisplay = ['id', 'price','name','image', 'stockQuantity', 'status', 'description', 'edit', 'remove'];
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ){

  }

  ngOnInit(){
    let params = this.getParametros();

    return this.productService
      .listProducts(params)
      .subscribe((response)=>{
        for(var i=0; i<response.data.result.products.length; i++){
          this.data.push(response.data.result.products[i]);
        }
        
      this.dataSource = new MatTableDataSource(this.data);
      });
  }
  private getParametros(): any {
    let params = {
      price: 0,
      name: "",
      image: "",
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
  remove(id: any) {
    this.productService.removeProduct(id)
    .subscribe((response) =>{
      
    })
    }
    
}

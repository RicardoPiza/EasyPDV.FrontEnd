import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ProductService } from 'src/app/@core/services/product.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
constructor(
  private productService: ProductService,
  public auth: AuthService,
    @Inject(DOCUMENT) 
    public document: Document
){

}
addProduct(){
  let product = {
    price: 12,
    name: 'Pastel',
    image: 'sem imagem',
    stockQuantity: 452,
    status: 'ativo',
    description: 'Pastel de carne'
  };
  this.productService.postProduct(product).subscribe(response => {
    if(response.success){
      console.log('Deu certo');
    }
  });
}
}

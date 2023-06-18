import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ThemeModule } from 'src/app/@core/shared/theme/theme.module';
import { PanelComponent } from './panel/panel.component';
import { DetailsComponent } from './details/details.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';




@NgModule({
  declarations: [
    PanelComponent,
    DetailsComponent    
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ThemeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class ProductsModule { }

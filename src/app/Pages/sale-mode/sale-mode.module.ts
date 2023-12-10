import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleModeRoutingModule } from './sale-mode-routing.module';
import { PanelComponent } from './panel/panel.component';
import { DetailsComponent } from './details/details.component';
import { ThemeModule } from 'src/app/@core/shared/theme/theme.module';
import { ProductsRoutingModule } from '../products/products-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgbPaginationModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CronometerComponent } from 'src/app/@core/shared/theme/cronometer/cronometer.component';


@NgModule({
  declarations: [
    PanelComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    SaleModeRoutingModule,
    ThemeModule,
    CommonModule,
    ProductsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbToastModule,
    MatIconModule,
    MatDividerModule

  ]
})
export class SaleModeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PanelComponent } from './panel/panel.component';
import { DetailsComponent } from './details/details.component';
import { ThemeModule } from 'src/app/@core/shared/theme/theme.module';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SoldProductsDashboardComponent } from './components/sold-products-dashboard/sold-products-dashboard.component';
import { SalesDashboardComponent } from './components/sales-dashboard/sales-dashboard.component';
import { EventsDashboardComponent } from './components/events-dashboard/events-dashboard.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    PanelComponent,
    DetailsComponent,
    SoldProductsDashboardComponent,
    SalesDashboardComponent,
    EventsDashboardComponent
  ],
  imports: [
    CommonModule,
    MatSortModule,
    DashboardRoutingModule,
    ThemeModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    MatPaginator
  ]
})
export class DashboardModule { }
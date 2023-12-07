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


@NgModule({
  declarations: [
    PanelComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ThemeModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTabsModule
  ],
  exports: [
    MatPaginator
  ]
})
export class DashboardModule { }

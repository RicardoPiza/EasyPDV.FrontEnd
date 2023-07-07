import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ThemeModule } from 'src/app/@core/shared/theme/theme.module';
import { PanelComponent } from './panel/panel.component';
import { DetailsComponent } from './details/details.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

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
export class ProductsModule { }

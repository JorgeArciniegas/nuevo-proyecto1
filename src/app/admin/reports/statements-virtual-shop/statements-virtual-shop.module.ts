import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatementsVirtualShopRoutingModule } from './statements-virtual-shop-routing.module';
import { SearchComponent } from './search/search.component';
import { SummaryComponent } from './summary/summary.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { StatementVirtualShopService } from './statement-virtual-shop.service';

@NgModule({
  declarations: [SearchComponent, SummaryComponent],
  imports: [
    CommonModule,
    StatementsVirtualShopRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [StatementVirtualShopService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StatementsVirtualShopModule { }

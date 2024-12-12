import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { VboxEditComponent } from './vbox-edit/vbox-edit.component';
import { VboxRoutingModule } from './vbox-routing.module';
import { VboxComponent } from './vbox.component';
import { VboxService } from './vbox.service';


@NgModule({
  declarations: [VboxComponent, VboxEditComponent],
  imports: [
    CommonModule,
    VboxRoutingModule,
    SharedModule
  ],
  providers: [VboxService]
})
export class VboxModule { }

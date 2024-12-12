import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { OperatorsRoutingModule } from './operators-routing.module';
import { OperatorsComponent } from './operators.component';


@NgModule({
  declarations: [OperatorsComponent, EditComponent, CreateComponent, DeleteComponent],
  imports: [
    CommonModule,
    OperatorsRoutingModule,
    SharedModule
  ]
})
export class OperatorsModule { }

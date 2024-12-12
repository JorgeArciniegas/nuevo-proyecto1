import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { OperatorsComponent } from './operators.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
      path: '',
      component: OperatorsComponent,
      },
      {
        path: 'edit',
        component : EditComponent,
      },
      {
        path: 'create',
        component: CreateComponent
      },
      {
        path: 'delete',
        component: DeleteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorsRoutingModule { }

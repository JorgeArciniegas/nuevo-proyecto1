import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VboxComponent } from './vbox.component';
import { VboxEditComponent } from './vbox-edit/vbox-edit.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: VboxComponent
      },
      {
        path: 'edit',
        component: VboxEditComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VboxRoutingModule { }

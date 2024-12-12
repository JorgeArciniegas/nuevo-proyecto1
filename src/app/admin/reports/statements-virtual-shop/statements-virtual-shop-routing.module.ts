import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: 'result',
    component: SummaryComponent
  },
  {
    path: '**',
    loadChildren: () => import('../../../error-page/error-page.module').then(m => m.ErrorPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementsVirtualShopRoutingModule { }

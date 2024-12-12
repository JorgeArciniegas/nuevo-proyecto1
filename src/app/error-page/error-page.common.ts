import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

export const componentDeclarations: any[] = [ErrorPageComponent];

export const routes: Routes = [
  {
    path: '',
    component: ErrorPageComponent
  }
];

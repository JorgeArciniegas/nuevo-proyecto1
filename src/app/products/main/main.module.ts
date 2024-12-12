import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { componentDeclarations, routes } from './main.common';
import { SoccerService } from './playable-board/templates/soccer/soccer.service';



@NgModule({
  declarations: [componentDeclarations],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [SoccerService]
})
export class MainModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { DigitslimitPipe } from '../component/pipe/digitslimit.pipe';
import { FloorPipe } from '../component/pipe/floor.pipe';
import { GroupByCategoryPipe } from '../component/pipe/groupBy.pipe';
import { HideLastResultPipe } from './pipes/hide-last-result.pipe';
import { SplitStringPipe } from './pipes/split-string.pipe';

@NgModule({
  declarations: [FloorPipe, SplitStringPipe, DigitslimitPipe, GroupByCategoryPipe, HideLastResultPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, MatGridListModule, TranslateModule, MatFormFieldModule, MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatGridListModule,
    TranslateModule,
    MatFormFieldModule,
    FloorPipe,
    SplitStringPipe,
    DigitslimitPipe,
    GroupByCategoryPipe,
    HideLastResultPipe,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ]
})
export class SharedModule { }

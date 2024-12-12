import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';
import { take,takeWhile} from 'rxjs/operators'
import { OperatorSummary } from './operator-summary.model';

@Injectable({
  providedIn: 'root'
})
export class PrintOperatorSummaryService {
  printingEnabled: boolean;
  operatorSummary: OperatorSummary;
  private printActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private router: Router) { 
    this.printActive.asObservable().subscribe(isActive =>{
      if(!isActive){
         // reset the router AND DISABLE PRINT
        timer(1000).subscribe(()=>{
          document.getElementById('app').classList.remove('isPrinting');
          this.operatorSummary = undefined;
          this.printingEnabled = false;
          this.router.navigate([{ outlets: { print: null } }]);
        });
      }
    });
  }

  printWindow(operatorSummary: OperatorSummary): void {
    this.operatorSummary = operatorSummary;
    this.printingEnabled = true;
    this.printActive.next(true);
    document.getElementById('app').classList.add('isPrinting');
    this.router.navigate(['/', { outlets: { print: 'print-operator-summary' } }]);
    timer(250).pipe(
      take(1),
      takeWhile(() => this.printingEnabled)
    ).subscribe(() => {
        window.print();
        this.printActive.next(false);
      });
  }
  resetPrint(): void { }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';
import { take,takeWhile} from 'rxjs/operators'
import { Receipt } from './print-receipt.model';

@Injectable({
  providedIn: 'root'
})
export class PrintReceiptService {
  printingEnabled: boolean;
  receipt: Receipt;
  private printActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private router: Router) { 
    this.printActive.asObservable().subscribe(isActive =>{
      if(!isActive){
         // reset the router AND DISABLE PRINT
        timer(1000).subscribe(()=>{
          document.getElementById('app').classList.remove('isPrinting');
          document.getElementsByClassName('cdk-overlay-container')[0].classList.remove('isPrinting');
          this.receipt = undefined;
          this.printingEnabled = false;
          this.router.navigate([{ outlets: { print: null } }]);
        });
      }
    });
  }

  printWindow(receipt: Receipt): void {
    this.receipt = receipt;
    this.printingEnabled = true;
    this.printActive.next(true);
    this.router.navigate(['/', { outlets: { print: 'print-receipt' } }]);
    document.getElementById('app').classList.add('isPrinting');
    document.getElementsByClassName('cdk-overlay-container')[0].classList.add('isPrinting');
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

import { Component, OnInit } from '@angular/core';
import { OperatorsService } from './operators.service';
import { RouterService } from '../../../services/utility/router/router.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {

  constructor(public operatorService: OperatorsService, private router: RouterService) { }

  ngOnInit() {
    this.operatorService.getListOfOperators();
  }



  previusPage() {
    if (this.operatorService.listOfOperators.actualPages <= 0) {
      return;
    }
    this.operatorService.listOfOperators.actualPages--;
    this.operatorService.filterOperators();
  }


  nextPage() {
    if (this.operatorService.listOfOperators.actualPages >= this.operatorService.listOfOperators.totalPages - 1) {
      return;
    }
    this.operatorService.listOfOperators.actualPages++;
    this.operatorService.filterOperators();
  }


  deleting(idx: number): void {
    this.operatorService.operatorMarked = this.operatorService.listTempOperators[idx];
    this.router.getRouter().navigate(['./admin/operators/delete']);
  }

  editing(idx: number): void {
    this.operatorService.operatorMarked = this.operatorService.listTempOperators[idx];
    this.router.getRouter().navigate(['./admin/operators/edit']);
  }
}

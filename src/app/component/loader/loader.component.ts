import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/utility/loader/loader.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-loader, [app-loader]',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loading: boolean;
  constructor(
    private loaderService: LoaderService, 
    public readonly userService: UserService) {}

  ngOnInit() {
    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }

  /**
   * When the spinner loading is show
   * This function prevent default to tap
   */
  onTap() {
    console.log('tap dismiss');
  }

}

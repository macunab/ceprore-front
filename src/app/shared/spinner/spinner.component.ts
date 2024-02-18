import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent implements OnInit{

  loading: boolean = true;

  constructor(private loadingService: LoadingService) {}
  
  ngOnInit(): void {

    this.loadingService.loadingSub
      .pipe()
      .subscribe( res => {
        this.loading = res;
      })
  }


}

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalOrders: number = 0;
  totalCustomers: number = 0;
  startedOrders: number = 0
  invoicedOrders: number = 0;
  invoicedLastWeeks: number = 0;
  paidOrders: number = 0;

  constructor(private orderService: OrderService, private customerService: CustomerService) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.orderService.countAllOrders('STARTED')
      .subscribe({
        next: res => {
          this.startedOrders = res;
        },
        error: err => {
          console.log(err);
        }
      });

    this.orderService.countAllOrders('INVOICED')
      .subscribe({
        next: res => {
          this.invoicedOrders = res;
        },
        error: err => {
          console.log(err);
        }
      });
    this.orderService.countAllOrdersLastWeek('INVOICED')
      .subscribe({
        next: res => {
          this.invoicedLastWeeks = res;
        },
        error: err => {
          console.log(err);
        }
      });
    this.customerService.countAllCustomers()
      .subscribe({
        next: res => {
          this.totalCustomers = res;
        },
        error: err => {
          console.log(err);
        }
      });
  }



}

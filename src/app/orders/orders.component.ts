import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h1>Your Orders</h1>
      <p>Here you can view your past orders.</p>
      
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td>{{ order.id }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.productId }}</td>
              <td>{{ order.quantity }}</td>
              <td>{{ order.orderDate |date }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="deleteOrder(order.id)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="6" class="text-center">No orders found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .bi-trash::before {
      content: "\\F5DE";
    }
    
    .bi {
      font-family: bootstrap-icons !important;
      font-style: normal;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe((data) => (this.orders = data));
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== id);
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          alert('Failed to delete order. Please try again.');
        }
      });
    }
  }
}
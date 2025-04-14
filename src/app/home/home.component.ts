import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { OrderService, Order } from '../services/order.service';
import { Product, BuyProduct } from '../models/product.model';

// Declare Bootstrap for TypeScript
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  purchaseQuantities: { [productId: number]: number } = {};
  customerName: { [productId: number]: string } = {}; // Changed from {pro} to string
  newProduct: Product = {
    id: 0, // This will be assigned by the API
    name: '',
    price: 0,
    quantity: 0
  };

  constructor(private productService: ProductService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      // Initialize purchase quantities
      this.products.forEach(product => {
        this.purchaseQuantities[product.id] = 1;
      });
    });
  }

  buyProduct(productId: number, quantity: number, customerName: string): void {
    if (!quantity || quantity <= 0) {
      alert('Please select a valid quantity');
      return;
    }

    const buyRequest: BuyProduct = {
      productId: productId,
      quantity: quantity,
      customerName: customerName // Use the customer name from the input field
    };

    this.orderService.createOrder(buyRequest).subscribe({
      next: (response) => {
        alert('Product purchased successfully!');
        // Refresh products and orders after purchase
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error purchasing product', error);
        alert('Failed to purchase product. Please try again.');
      }
    });
  }

  isProductValid(): boolean {
    return this.newProduct.name.trim() !== '' && this.newProduct.price > 0 && this.newProduct.quantity > 0;
  }

  addProduct(): void {
    if (!this.isProductValid()) {
      alert('Please complete all product details correctly.');
      return;
    }

    this.productService.addProduct(this.newProduct).subscribe({
      next: () => {
        // Reset the form
        this.newProduct = { id: 0, name: '', price: 0, quantity: 0 };
        // Close the modal using Bootstrap's modal method
        const modalElement = document.getElementById('addProductModal');
        const modalInstance = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // Fallback if the Bootstrap modal instance is not available
          document.getElementById('addProductModal')?.classList.remove('show');
          document.querySelector('.modal-backdrop')?.remove();
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');
        }
        // Refresh the product list
        this.loadProducts();
        alert('Product added successfully!');
      },
      error: (error) => {
        console.error('Error adding product', error);
        alert('Failed to add product. Please try again.');
      }
    });
  }
}
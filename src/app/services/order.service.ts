import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuyProduct } from '../models/product.model';

export interface Order {
  id: number;
  productId: string;
  customerName: string;
  quantity: number;
  orderDate: string;}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = '/api/Order';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(buyRequest: BuyProduct): Observable<any> {
    return this.http.post(this.apiUrl, buyRequest);
  }
  
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface BuyProduct {
    productId: number;
    quantity: number;
    customerName: string; // Changed from {pro} to string
}
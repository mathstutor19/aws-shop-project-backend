// lambda/products.ts

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
}

export const products: Product[] = [
  { id: "1", title: "Product 1", price: 10, description: "Backend Lambda List" },
  { id: "2", title: "Product 2", price: 15, description: "Backend Lambda List" },
  { id: "3", title: "Product 3", price: 20, description: "Backend Lambda List" },
  { id: "4", title: "Product 4", price: 25, description: "Backend Lambda List" },
  { id: "5", title: "Product 5", price: 30, description: "Backend Lambda List" }
];
import { ProductCart } from '@/interfaces/product';

export interface Cart {
  id: string;
  name: string;
  products: ProductCart[];
  total: 0;
}

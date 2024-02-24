import { Customer } from './customer';
import { ProductCart } from '@/interfaces/product';

export type Transaction = {
  transactionType: 'fiado' | 'payment' | 'purchase' | 'withdraw';
  date: string;
  customers: { customer: Customer; transactionValue: number }[];
  products: Partial<ProductCart>[];
  paymentType?: 'money' | 'debit' | 'credit';
  jurosCard?: { percents: number; value: number };

  totalSell: number;
  totalPaid: number;
  lucro: number;
  percents?: number;

  advanced?: { transactionValue: number; lucro: number };

  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
};

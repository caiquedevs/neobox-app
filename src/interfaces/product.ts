export type ProductType = 'unit' | 'burden';

export type Replacement = {
  type: ProductType;
  qtd: number | undefined;
  date: string;
  unit: {
    pricePaid: number | undefined | null;
  };
  burden: {
    pricePaid: number | undefined | null;
  };
};

export type Stock = {
  qtd: number;
  products: Replacement[];
};

export type Product = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: string;

  name: string;
  min: number | undefined;
  max: number | undefined;
  category: string;
  market: string;
  hasBurden: boolean;
  burdenIsSold: boolean;
  stockAlert: boolean;

  unit: Unit;
  burden: Burden;

  stock: Stock;
};

interface Unit {
  uri: '';
  priceSell: number | undefined;
  barcode: string;
  productWeight: string;
}

interface Burden {
  uri: '';
  priceSell: number | undefined;
  burdenUnits: number | undefined;
  barcode: string;
  productWeight: string;
}

export interface ProductCart extends Product {
  unit: Unit & {
    amount: number;
  };
  burden: Burden & {
    amount: number;
  };
}

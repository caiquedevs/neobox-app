export interface Replacement {
  _id: string | undefined;
  createdAt: string;
  updatedAt: string;
  __v: string;

  date: string;
  burdenUnits: number;
  qtd: number;
  productType: string;
  unit: {
    pricePaid: number;
  };
  burden: {
    pricePaid: number;
  };
}

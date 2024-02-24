export interface Config {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  bestList: string[];
  categories?: string[];
  markets?: string[];
  juros: {
    debit: number;
    credit: number;
  };
}

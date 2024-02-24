import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Product } from '../interfaces/product';
import { Config } from '../interfaces/config';
import { ReplacementFormData } from '../components/FormReplacement';

interface Props {
  children: React.ReactNode;
}

interface GlobalContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  // ---------------
  marketProducts: Product[];
  setMarketProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  // ---------------
  config: Config | null;
  setConfig: React.Dispatch<React.SetStateAction<Config | null>>;
  // ---------------
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  // ---------------
  stock: ReplacementFormData[];
  setStock: React.Dispatch<React.SetStateAction<ReplacementFormData[]>>;
  // ---------------
  handleChangeMarket: (index: number, arrProducts?: Product[], arrMarkets?: string[]) => void;
}

const GLobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: Props) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [marketProducts, setMarketProducts] = React.useState<Product[]>([]);
  const [config, setConfig] = React.useState<Config | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [stock, setStock] = React.useState<ReplacementFormData[]>([]);

  const handleChangeMarket = (
    index: number,
    arrProducts: Product[] | undefined = undefined,
    arrMarkets: string[] | undefined = undefined
  ) => {
    const argProduts = arrProducts || products;
    const argMarkets = arrMarkets || config?.markets;

    const filtered = argProduts.filter((product) => product.market === argMarkets?.[index]);
    setMarketProducts(filtered);
  };

  return (
    <GLobalContext.Provider
      value={{
        products,
        setProducts,
        config,
        setConfig,
        activeIndex,
        setActiveIndex,
        marketProducts,
        setMarketProducts,
        stock,
        setStock,
        handleChangeMarket,
      }}
    >
      {children}
    </GLobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GLobalContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  return context;
};

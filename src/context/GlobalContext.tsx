import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Product } from '../interfaces/product';
import { Config } from '../interfaces/config';
import { CartFormData } from '../components/FormReplacement';
import * as Network from 'expo-network';
import { ReplacementApp } from '../interfaces/replacementApp';

interface Props {
  children: React.ReactNode;
}

interface GlobalContextProps {
  purchaseList: Product[];
  setPurchaseList: React.Dispatch<React.SetStateAction<Product[]>>;
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
  cart: CartFormData[];
  setCart: React.Dispatch<React.SetStateAction<CartFormData[]>>;
  // ---------------
  network: { connection: boolean; ready: boolean };
  setNetwork: React.Dispatch<React.SetStateAction<{ connection: boolean; ready: boolean }>>;
  // ---------------
  replacement: ReplacementApp[];
  setReplacement: React.Dispatch<React.SetStateAction<ReplacementApp[]>>;
  // ---------------
  handleChangeMarket: (index: number, products: Product[], markets: string[]) => void;
  verifyNetwork: () => Promise<boolean>;
}

const GLobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: Props) => {
  const [purchaseList, setPurchaseList] = React.useState<Product[]>([]);
  const [marketProducts, setMarketProducts] = React.useState<Product[]>([]);
  const [config, setConfig] = React.useState<Config | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [cart, setCart] = React.useState<CartFormData[]>([]);
  const [network, setNetwork] = React.useState({ connection: false, ready: false });
  const [replacement, setReplacement] = React.useState<ReplacementApp[]>([]);

  const handleChangeMarket = (index: number, products: Product[], markets: string[]) => {
    const filtered = products?.filter((product) => product.market === markets?.[index]) || [];
    setMarketProducts(filtered);
  };

  const verifyNetwork = async (): Promise<boolean> => {
    const status = await Network.getNetworkStateAsync();
    return Boolean(status?.isConnected);
  };

  React.useEffect(() => {
    (async () => {
      const connection = await verifyNetwork();
      setNetwork({ connection, ready: true });
    })();

    return () => {};
  }, []);

  return (
    <GLobalContext.Provider
      value={{
        purchaseList,
        setPurchaseList,
        config,
        setConfig,
        activeIndex,
        setActiveIndex,
        marketProducts,
        setMarketProducts,
        cart,
        setCart,
        handleChangeMarket,
        verifyNetwork,
        network,
        setNetwork,
        replacement,
        setReplacement,
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

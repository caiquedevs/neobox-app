import React from 'react';
import { Keyboard, View } from 'react-native';

import { CarouselSection } from '../components/Carousel';
import { ProductListSection } from '../components/ProductList';
import { fetchProducts } from '../services/productService';
import { fetchConfig } from '../services/configService';
import { useGlobalContext } from '../context/GlobalContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeModal, { SwipeModalProps } from '../components/SwipeModal';
import { Product } from '../interfaces/product';
import { FormReplacement, ReplacementFormData } from '../components/FormReplacement';
import { getStorage } from '../utils/storage';

type Props = {};

export const HomeScreen = (props: Props) => {
  const modalRef = React.useRef<SwipeModalProps>(null);

  const { setProducts, setConfig, handleChangeMarket, setStock } = useGlobalContext();

  React.useEffect(() => {
    Promise.all([fetchProducts(), fetchConfig(), getStorage('stock')])
      .then(([productsResult, configResult, stockResult]) => {
        setProducts(productsResult);
        setConfig(configResult);

        handleChangeMarket(0, productsResult, configResult.markets);
        setStock((stockResult as ReplacementFormData[]) || []);
      })
      .catch(() => alert('Erro ao buscar dados'));

    return () => {};
  }, []);

  return (
    <GestureHandlerRootView className="w-full flex-1 bg-red-500">
      <View className="w-full h-full bg-white">
        <CarouselSection />
        <ProductListSection modalRef={modalRef} />
      </View>

      <SwipeModal ref={modalRef} height="auto" openPosition={0}>
        {(product: Product) => <FormReplacement modalRef={modalRef} product={product} />}
      </SwipeModal>
    </GestureHandlerRootView>
  );
};

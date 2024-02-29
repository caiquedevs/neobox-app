import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CarouselSection } from '../components/Carousel';
import { ProductListSection } from '../components/ProductList';
import { fetchPurchaseList, fetchReplacements } from '../services/productService';
import { fetchConfig } from '../services/configService';
import { useGlobalContext } from '../context/GlobalContext';
import SwipeModal, { SwipeModalProps } from '../components/SwipeModal';
import { Product } from '../interfaces/product';
import { FormReplacement, CartFormData } from '../components/FormReplacement';
import { asyncStorage } from '../utils/storage';
import { Config } from '../interfaces/config';
import { Footer } from '../components/Footer';
import { Replacement } from '../interfaces/replacement';
import { BtnUpload } from '../components/BtnUpload';
import { useToast } from 'react-native-toast-notifications';

export const HomeScreen = () => {
  const toast = useToast();
  const storage = asyncStorage();
  const modalRef = React.useRef<SwipeModalProps>(null);

  const { setProducts, setConfig, setCart, setReplacement, handleChangeMarket, network } = useGlobalContext();

  React.useEffect(() => {
    if (!network.ready || network.connection) return;

    const offlinePromisses = [
      storage.get('cart'),
      storage.get('replacements'),
      storage.get('products'),
      storage.get('config'),
    ];

    Promise.all(offlinePromisses)
      .then(([cartPersistedResult, replacementPersistedResult, productPersistedResult, configPersistedResult]) => {
        console.log('Has error stockPersistedResult', cartPersistedResult instanceof Error);
        const cart = cartPersistedResult as CartFormData[];
        const product = productPersistedResult as Product[];
        const config = configPersistedResult as Config;
        const replacement = replacementPersistedResult as Replacement[];

        setCart(cart || []);
        setProducts(product || []);
        setConfig(config || []);
        setReplacement(replacement || []);

        handleChangeMarket(0, product, config?.markets);
      })
      .catch((err) => {
        toast.show('Houve um erro ao tentar realizar essa ação', { type: 'danger' });
      });

    return () => {};
  }, [network]);

  React.useEffect(() => {
    if (!network.ready || !network.connection) return;

    const onlinePromisses = [fetchPurchaseList(), fetchConfig(), fetchReplacements(), storage.get('cart')];

    Promise.all(onlinePromisses)
      .then(([productsResult, configResult, replacementResult, cartPersistedResult = []]) => {
        storage.set('products', productsResult);
        storage.set('config', configResult);
        storage.set('replacements', replacementResult);

        setCart(cartPersistedResult);

        setProducts(productsResult);
        setConfig(configResult);
        setReplacement(replacementResult);

        handleChangeMarket(0, productsResult, configResult.markets);
      })
      .catch((err) => {
        toast.show('Houve um erro ao tentar realizar essa ação', { type: 'danger' });
      });

    return () => {};
  }, [network]);

  return (
    <GestureHandlerRootView className="w-full flex-1 bg-red-500">
      <View className="w-full h-full bg-white">
        <CarouselSection />
        <ProductListSection modalRef={modalRef} />
      </View>

      <SwipeModal ref={modalRef} height="auto" openPosition={0}>
        {(product: Product) => <FormReplacement modalRef={modalRef} product={product} />}
      </SwipeModal>

      <BtnUpload />
      <Footer />
    </GestureHandlerRootView>
  );
};

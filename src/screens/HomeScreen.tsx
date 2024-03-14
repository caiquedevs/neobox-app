import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CarouselSection } from '../components/Carousel';
import { PurchaseList } from '../components/PurchaseList';
import { fetchPurchaseList, fetchReplacements } from '../services/productService';
import { fetchConfig } from '../services/configService';
import { useGlobalContext } from '../context/GlobalContext';
import SwipeModal, { SwipeModalProps } from '../components/SwipeModal';
import { Product } from '../interfaces/product';
import { FormReplacement, CartFormData } from '../components/FormReplacement';
import { asyncStorage } from '../utils/storage';
import { Config } from '../interfaces/config';
import { Footer } from '../components/Footer';
import { ReplacementApp } from '../interfaces/replacementApp';
import { BtnUpload } from '../components/BtnUpload';
import { useToast } from 'react-native-toast-notifications';

export const HomeScreen = () => {
  const toast = useToast();
  const storage = asyncStorage();
  const modalRef = React.useRef<SwipeModalProps>(null);

  const { setPurchaseList, setConfig, setCart, setReplacement, handleChangeMarket, network } = useGlobalContext();

  //OFFLINE RENDER
  React.useEffect(() => {
    if (!network.ready || network.connection) return;

    const offlinePromisses = [
      storage.get('cart'),
      storage.get('replacements'),
      storage.get('purchaseList'),
      storage.get('config'),
    ];

    Promise.all(offlinePromisses)
      .then(([cartPersistedResult, replacementPersistedResult, purchaseListPersistedResult, configPersistedResult]) => {
        const cart = cartPersistedResult as CartFormData[];
        const purchaseList = purchaseListPersistedResult as Product[];
        const config = configPersistedResult as Config;
        const replacement = replacementPersistedResult as ReplacementApp[];

        setCart(cart || []);
        setPurchaseList(purchaseList || []);
        setConfig(config || []);
        setReplacement(replacement || []);

        handleChangeMarket(0, purchaseList || [], config.markets || []);
      })
      .catch((err) => {
        toast.show('Houve um erro ao tentar realizar essa ação', { type: 'danger' });
      });

    return () => {};
  }, [network]);

  //ONLINE RENDER
  React.useEffect(() => {
    if (!network.ready || !network.connection) return;

    const onlinePromisses = [fetchPurchaseList(), fetchConfig(), fetchReplacements(), storage.get('cart')];

    Promise.all(onlinePromisses)
      .then(([purchaseListResult, configResult, replacementResult, cartPersistedResult = []]) => {
        storage.set('purchaseList', purchaseListResult);
        storage.set('config', configResult);
        storage.set('replacements', replacementResult);

        setCart(cartPersistedResult);
        setPurchaseList(purchaseListResult);
        setConfig(configResult);
        setReplacement(replacementResult);

        handleChangeMarket(0, purchaseListResult, configResult.markets);
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
        <PurchaseList modalRef={modalRef} />
      </View>

      <SwipeModal ref={modalRef} height="auto" openPosition={0}>
        {(product: Product) => <FormReplacement modalRef={modalRef} product={product} />}
      </SwipeModal>

      <BtnUpload />
      <Footer />
    </GestureHandlerRootView>
  );
};

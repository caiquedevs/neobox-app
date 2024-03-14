import React from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { SwipeModalProps } from './SwipeModal';
import { useGlobalContext } from '../context/GlobalContext';
import ProductRow from './ProductRow';
import { fetchPurchaseList, fetchReplacements } from '../services/productService';
import { fetchConfig } from '../services/configService';
import { asyncStorage } from '../utils/storage';
import { useToast } from 'react-native-toast-notifications';

type Props = {
  modalRef: React.RefObject<SwipeModalProps>;
};

export const PurchaseList = (props: Props) => {
  const toast = useToast();
  const storage = asyncStorage();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const { marketProducts, verifyNetwork, setPurchaseList, setConfig, setReplacement, activeIndex, handleChangeMarket } =
    useGlobalContext();
  const listViewData = marketProducts.map((product) => ({ key: product._id, product }));

  const onRefresh = async () => {
    const connection = await verifyNetwork();
    if (!connection) return toast.show('Você precisa de internet para fazer essa ação!', { type: 'danger' });

    setIsRefreshing(true);

    const onlinePromisses = [fetchPurchaseList(), fetchConfig(), fetchReplacements()];

    Promise.all(onlinePromisses)
      .then(([purchaseListResult, configResult, replacementResult]) => {
        storage.set('products', purchaseListResult);
        storage.set('config', configResult);
        storage.set('replacements', replacementResult);

        setPurchaseList(purchaseListResult);
        setConfig(configResult);
        setReplacement(replacementResult);

        handleChangeMarket(activeIndex, purchaseListResult, configResult.markets);
        setIsRefreshing(false);
      })
      .catch((err) => {
        setIsRefreshing(false);
        toast.show('Houve um erro ao tentar realizar essa ação', { type: 'danger' });
      });
  };

  return (
    <FlatList
      data={listViewData}
      bounces={false}
      initialNumToRender={10}
      removeClippedSubviews={true}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingBottom: 150 }}
      renderItem={({ item, index }) => {
        const handlePress = () => props.modalRef.current?.openModal(item.product);
        return <ProductRow product={item.product} onPress={handlePress} />;
      }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    />
  );
};

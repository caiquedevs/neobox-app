import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Path, Rect, Svg } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

import SwipeModal, { SwipeModalProps } from './SwipeModal';
import { useGlobalContext } from '../context/GlobalContext';
import { ShowIf } from './ShowIf';
import { Image } from './Image';

type Props = {
  modalRef: React.RefObject<SwipeModalProps>;
};

export const ProductListSection = (props: Props) => {
  const { marketProducts, stock } = useGlobalContext();
  const listViewData = marketProducts.map((product) => ({ key: product._id, product }));

  return (
    <FlatList
      data={listViewData}
      bounces={false}
      initialNumToRender={10}
      removeClippedSubviews={true}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const product = item.product;

        const hasReplacement = stock?.find((item) => item._id === product._id);
        const type = product.hasBurden ? 'burden' : 'unit';

        const pricePaid = hasReplacement
          ? Number(hasReplacement.pricePaid).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })
          : product.stock.products.length
          ? product.stock.products[product.stock.products.length - 1][type].pricePaid?.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })
          : 'N/A';

        const qtd = hasReplacement
          ? hasReplacement.qtd
          : product.hasBurden
          ? Math.round((product.max! - product.stock.qtd) / product.burden.burdenUnits!)
          : product.max! - product.stock.qtd;

        const handlePress = () => {
          props.modalRef.current?.openModal(product);
        };

        return (
          <Pressable
            onPress={handlePress}
            className={`pl-2 pr-4 py-3 flex-row items-center  border-b ${
              hasReplacement ? 'bg-teal-100 border-teal-300' : 'bg-white border-gray-300'
            }`}
          >
            <View className="w-14 h-14 bg-white rounded-lg overflow-hidden">
              <Image
                uri={hasReplacement ? product[hasReplacement.type!].uri : product.burden.uri || product.unit.uri}
                imgClass="w-full h-full"
              />
            </View>

            <View className="pl-3 flex-1 gap-1">
              <Text className="text-black text-lg">{product.name}</Text>

              <View className="flex-row justify-between">
                <Text className="text-black">{qtd}x</Text>
                <Text className="text-black">{pricePaid}</Text>
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
};

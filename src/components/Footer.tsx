import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { useGlobalContext } from '../context/GlobalContext';

export const Footer = () => {
  const { cart } = useGlobalContext();

  const totalCart = cart.reduce((acc, product) => {
    return (acc += Number(product.pricePaid) * Number(product.qtd));
  }, 0);

  return (
    <View className="w-full pl-5 pr-5 pt-4 pb-4 flex-row absolute bottom-0 bg-zinc-800 rounded-t-2xl">
      <View className="flex-1">
        <View className="flex-row flex-1 justify-between">
          <Text className="text-xl text-teal-400">Total carrinho</Text>
          <Text className="text-xl text-teal-400">
            {totalCart.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </Text>
        </View>
      </View>
    </View>
  );
};

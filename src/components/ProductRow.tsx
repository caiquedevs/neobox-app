import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { useGlobalContext } from '../context/GlobalContext';
import { Product } from '../interfaces/product';
import { Image } from './Image';

type Props = {
  product: Product;
  onPress: () => void;
};

const ProductRow = ({ product, onPress }: Props) => {
  const { cart, replacement } = useGlobalContext();

  const isPending = replacement?.find((item) => item._id === product._id);
  const haveInCart = cart?.find((item) => item._id === product._id);
  const type = product.hasBurden ? 'burden' : 'unit';

  if (isPending) return null;

  const pricePaid = haveInCart
    ? Number(haveInCart.pricePaid)
    : product.stock.products?.length
    ? product.stock.products[product.stock.products?.length - 1][type].pricePaid
    : 'N/A';

  const qtd = haveInCart
    ? haveInCart.qtd
    : product.hasBurden
    ? Math.round(product.max! / (product.burden?.burdenUnits || 0))
    : product.max;

  const weight = haveInCart
    ? product[haveInCart.productType!]?.productWeight
    : product.hasBurden
    ? product.burden?.productWeight
    : product.unit?.productWeight;

  return (
    <Pressable
      onPress={onPress}
      className={`pl-2 pr-4 py-3 flex-row items-center  border-b ${
        haveInCart ? 'bg-teal-100 border-teal-300' : 'bg-white border-gray-300'
      }`}
    >
      <View className="w-14 h-14 bg-white rounded-lg overflow-hidden">
        <Image
          uri={haveInCart ? product[haveInCart.productType!]?.uri : product.burden?.uri || product.unit?.uri}
          imgClass="w-full h-full"
        />
      </View>

      <View className="pl-3 flex-1">
        <Text className="text-black text-lg">
          {product.name} {weight}
        </Text>

        <View className="flex-row justify-between">
          <Text className="text-black text-lg">
            {qtd}x - {product.market}
          </Text>
          <Text className="text-black text-lg">
            {pricePaid?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}{' '}
            {haveInCart ? `/ ${haveInCart.total?.toLocaleString('pt-br', { minimumFractionDigits: 2 })}` : null}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductRow;

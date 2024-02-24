import React from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Product, ProductType, Replacement } from '../interfaces/product';
import { getStorage, removeStorage, setStorage } from '../utils/storage';
import { useGlobalContext } from '../context/GlobalContext';
import { Image } from './Image';
import { SwipeModalProps } from './SwipeModal';

type Props = {
  product?: Product;
  modalRef: React.RefObject<SwipeModalProps>;
};

interface ProductReplacement extends Product {
  qtd: string;
  pricePaid?: string;
}

export interface ReplacementFormData {
  _id: string | undefined;
  pricePaid: string | undefined;
  type: ProductType | undefined;
  qtd: string | undefined;
}

const initialValues: ReplacementFormData = {
  _id: '' as string | undefined,
  pricePaid: undefined as string | undefined,
  type: undefined as ProductType | undefined,
  qtd: undefined as string | undefined,
};

export const FormReplacement = (props: Props) => {
  if (!props.product) return null;

  const { stock, setStock } = useGlobalContext();

  const [values, setValues] = React.useState(initialValues);
  const [product, setProduct] = React.useState<ProductReplacement | undefined>(undefined);

  const editData = stock?.find((obj) => obj._id === props.product?._id);

  const handleChangeType = (type: ProductType) => {
    if (editData && type === editData.type) {
      setProduct((old) => ({ ...old!, qtd: editData.qtd!, pricePaid: editData.pricePaid! }));
      setValues({ ...editData, type });
      return;
    }

    const lengthProducts = product?.stock.products.length;
    const pricePaid = lengthProducts ? product.stock.products[lengthProducts - 1][type].pricePaid : '0.00';

    const qtd =
      type === 'burden'
        ? Math.round((product?.max! - product?.stock.qtd!) / product?.burden.burdenUnits!)
        : product?.max! - product?.stock.qtd!;

    setProduct((old) => ({ ...old!, qtd: qtd.toString(), pricePaid: pricePaid?.toString() }));
    setValues({ ...initialValues, type });
  };

  const handleChangePrice = (text: string) => {
    setValues((old) => ({
      ...old,
      pricePaid: text.replace(/[^0-9]/g, '').replace(/^(\d+)(\d{2})$/, '$1.$2'),
    }));
  };

  const handleSubmit = async () => {
    // return removeStorage('stock');

    props.modalRef.current?.closeModal();
    Keyboard.dismiss();

    const stockStorage = (await getStorage<ReplacementFormData[] | undefined>('stock')) || [];
    const index = stockStorage.findIndex((obj) => obj._id === product?._id);

    const qtd =
      values.type === 'burden'
        ? Math.round((product?.max! - (product?.stock.qtd || 0)) / product?.burden.burdenUnits!)
        : product?.max! - (product?.stock.qtd || 0);

    const payload = {
      _id: product?._id,
      type: values.type,
      pricePaid: values.pricePaid || product?.pricePaid,
      qtd: values.qtd || qtd.toString(),
    };

    if (index !== -1) {
      stockStorage[index] = payload;
      setStorage('stock', stockStorage);
      setStock((old) => {
        const newProducts = [...old];
        newProducts[index] = payload;
        return newProducts;
      });
    } else {
      stockStorage.push(payload);
      setStorage('stock', stockStorage);
      setStock((old) => old.concat(payload));
    }
  };

  React.useEffect(() => {
    const currentProduct = props.product;

    if (!currentProduct || editData) return;

    const lengthProducts = currentProduct.stock.products.length;
    const type = currentProduct.hasBurden ? 'burden' : 'unit';

    const qtd =
      type === 'burden'
        ? Math.round((currentProduct.max! - currentProduct.stock.qtd) / currentProduct.burden.burdenUnits!)
        : currentProduct.max! - currentProduct.stock.qtd;

    setProduct({
      ...currentProduct,
      qtd: qtd.toString(),
      pricePaid: lengthProducts
        ? currentProduct.stock.products[lengthProducts - 1][type].pricePaid?.toString()
        : '0.00',
    });

    setValues((old) => ({ ...old, type }));

    return () => {};
  }, [props.product]);

  React.useEffect(() => {
    if (!props.product || !editData) return;

    setProduct({ ...props.product!, qtd: editData.qtd!, pricePaid: editData.pricePaid! });
    setValues(editData);

    return () => {};
  }, [props.product]);

  return (
    <View className="pb-3">
      <View className="px-5 pt-3 bg-emerald-500 rounded-t-3xl -top-2">
        <Text numberOfLines={2} ellipsizeMode="tail" className="text-white text-xl">
          {props.product.name}
        </Text>

        <View className="pb-5 pt-3 flex-row items-center justify-between">
          <View className="w-20 h-20 mr-3 bg-white rounded-lg overflow-hidden">
            <Image uri={product?.[values.type!]?.uri} imgClass="w-full h-full" />
          </View>

          <TextInput
            autoFocus
            keyboardType="number-pad"
            value={values.pricePaid}
            placeholder={product?.pricePaid}
            onChangeText={handleChangePrice}
            placeholderTextColor="#ffffff9b"
            style={{ fontSize: 60, lineHeight: 75 }}
            className="flex-1 h-[115px] text-white text-right "
          />
        </View>
      </View>

      <View className="h-full px-5 -top-2 bg-white rounded-t-xl">
        <View className="pt-5 flex-row items-center gap-x-5">
          <View className="flex-row">
            <Pressable
              onPress={() => handleChangeType('burden')}
              className={`px-3 py-1 mr-3 rounded-lg ${values.type === 'burden' ? 'bg-emerald-600' : 'bg-zinc-400'}`}
            >
              <Text className="text-white text-lg">Fardo</Text>
            </Pressable>

            <Pressable
              onPress={() => handleChangeType('unit')}
              className={`px-3 py-1 rounded-lg ${values.type === 'unit' ? 'bg-emerald-600' : 'bg-zinc-400'}`}
            >
              <Text className="text-white text-lg">Unidade</Text>
            </Pressable>
          </View>
        </View>

        <Text className="mt-5 text-lg">Quantidade</Text>

        <TextInput
          keyboardType="number-pad"
          value={values.qtd}
          placeholder={product?.qtd}
          onChangeText={(value) => setValues((old) => ({ ...old, qtd: value.replace(/\D/g, '') }))}
          placeholderTextColor="#a4b7a7"
          style={{ fontSize: 25, lineHeight: 35 }}
          className="w-full h-14 pt-1 pb-3 border-b border-zinc-400 text-emerald-500 focus:border-emerald-500"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.75}
          className="w-full h-16 mt-10 rounded-lg bg-emerald-500 items-center justify-center"
        >
          <Text className="text-lg text-white">Salvar alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

import React from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Product, ProductType, Replacement } from '../interfaces/product';
import { asyncStorage } from '../utils/storage';
import { useGlobalContext } from '../context/GlobalContext';
import { Image } from './Image';
import { SwipeModalProps } from './SwipeModal';
import { ShowIf } from './ShowIf';
import { Path, Svg } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

type Props = {
  product?: Product;
  modalRef: React.RefObject<SwipeModalProps>;
};

interface ProductReplacement extends Product {
  qtd: string;
  pricePaid?: string;
}

export interface CartFormData {
  _id: string | undefined;
  pricePaid: string | undefined;
  productType: ProductType | undefined;
  qtd: string | undefined;
  total?: number;
  burdenUnits?: number;
}

const initialValues: CartFormData = {
  _id: '' as string | undefined,
  pricePaid: undefined as string | undefined,
  productType: undefined as ProductType | undefined,
  qtd: undefined as string | undefined,
  burdenUnits: undefined,
  total: 0,
};

export const FormReplacement = (props: Props) => {
  if (!props.product) return null;

  const toast = useToast();

  const storage = asyncStorage();

  const { cart, setCart } = useGlobalContext();

  const [values, setValues] = React.useState(initialValues);
  const [product, setProduct] = React.useState<ProductReplacement | undefined>(undefined);

  const editData = cart?.find((obj) => obj._id === props.product?._id);

  const handlePressDelete = async () => {
    const cartStorage = (await storage.get<CartFormData[] | undefined>('cart')) || [];
    const index = cartStorage.findIndex((obj) => obj._id === product?._id);

    setCart((old) => old.filter((obj) => obj._id !== cartStorage[index]._id));

    cartStorage.splice(index, 1);
    storage.set('cart', cartStorage);

    props.modalRef.current?.closeModal();
  };

  const handleChangeType = (productType: ProductType) => {
    if (editData && productType === editData.productType) {
      setProduct((old) => ({ ...old!, qtd: editData.qtd!, pricePaid: editData.pricePaid! }));
      setValues({ ...editData, productType });
      return;
    }

    const lengthProducts = product?.stock.products.length;
    const pricePaid = lengthProducts ? product.stock.products[lengthProducts - 1][productType].pricePaid : '0.00';

    const qtd =
      productType === 'burden'
        ? Math.round((product?.max! - product?.stock.qtd!) / product?.burden.burdenUnits!)
        : product?.max! - product?.stock.qtd!;

    setProduct((old) => ({ ...old!, qtd: qtd.toString(), pricePaid: pricePaid?.toString() }));
    setValues({ ...initialValues, productType });
  };

  const handleChangePrice = (text: string) => {
    setValues((old) => ({
      ...old,
      pricePaid: text.replace(/[^0-9]/g, '').replace(/^(\d+)(\d{2})$/, '$1.$2'),
    }));
  };

  const handleSubmit = async () => {
    const cartStorage = (await storage.get<CartFormData[] | undefined>('cart')) || [];
    const index = cartStorage.findIndex((obj) => obj._id === product?._id);

    const qtdDefault =
      values.productType === 'burden'
        ? Math.round((product?.max! - (product?.stock.qtd || 0)) / product?.burden.burdenUnits!)
        : product?.max! - (product?.stock.qtd || 0);

    const qtd = values.qtd || qtdDefault.toString();
    const pricePaid = values.pricePaid || product?.pricePaid;
    const total = Number(pricePaid) * Number(qtd);

    const payload = {
      _id: product?._id,
      burdenUnits: product?.burden?.burdenUnits || 0,
      productType: values.productType,
      pricePaid,
      total,
      qtd,
    };

    if (Number(payload.pricePaid) <= 0) return toast.show('Preço inválido', { type: 'warning' });
    if (Number(payload.qtd) <= 0) return toast.show('Quantidade inválida', { type: 'warning' });

    if (index !== -1) {
      cartStorage[index] = payload;
      storage.set('cart', cartStorage);
      setCart((old) => {
        const newProducts = [...old];
        newProducts[index] = payload;
        return newProducts;
      });
    } else {
      cartStorage.push(payload);
      storage.set('cart', cartStorage);
      setCart((old) => old.concat(payload));
    }

    props.modalRef.current?.closeModal();
  };

  React.useEffect(() => {
    const currentProduct = props.product;

    if (!currentProduct || editData) return;

    const lengthProducts = currentProduct.stock.products.length;
    const productType = currentProduct.hasBurden ? 'burden' : 'unit';

    const qtd =
      productType === 'burden'
        ? Math.round((currentProduct.max! - currentProduct.stock.qtd) / currentProduct.burden.burdenUnits!)
        : currentProduct.max! - currentProduct.stock.qtd;

    setProduct({
      ...currentProduct,
      qtd: qtd.toString(),
      pricePaid: lengthProducts
        ? currentProduct.stock.products[lengthProducts - 1][productType].pricePaid?.toString()
        : '0.00',
    });

    setValues((old) => ({ ...old, productType }));

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
            <Image uri={product?.[values.productType!]?.uri} imgClass="w-full h-full" />
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
            <ShowIf show={product?.hasBurden}>
              <Pressable
                onPress={() => handleChangeType('burden')}
                className={`px-3 py-1 mr-3 rounded-lg ${
                  values.productType === 'burden' ? 'bg-emerald-600' : 'bg-zinc-400'
                }`}
              >
                <Text className="text-white text-lg">Fardo</Text>
              </Pressable>
            </ShowIf>

            <Pressable
              onPress={() => handleChangeType('unit')}
              className={`px-3 py-1 rounded-lg ${values.productType === 'unit' ? 'bg-emerald-600' : 'bg-zinc-400'}`}
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

        <View className="pt-5 flex-row items-center gap-4">
          <ShowIf show={Boolean(editData)}>
            <TouchableOpacity
              onPress={handlePressDelete}
              activeOpacity={0.75}
              className="px-5 h-16 bg-red-200 rounded-lg items-center justify-center"
            >
              <Svg width="22" height="25" viewBox="0 0 22 25" fill="none">
                <Path
                  d="M21.2979 3.92157H16.383V2.69608C16.383 1.98103 16.1117 1.29528 15.6289 0.789663C15.1461 0.28405 14.4913 0 13.8085 0H8.19149C7.5087 0 6.85387 0.28405 6.37107 0.789663C5.88826 1.29528 5.61702 1.98103 5.61702 2.69608V3.92157H0.702128C0.515912 3.92157 0.337323 3.99904 0.205648 4.13693C0.0739739 4.27483 0 4.46185 0 4.65686C0 4.85187 0.0739739 5.0389 0.205648 5.17679C0.337323 5.31469 0.515912 5.39216 0.702128 5.39216H1.87234V23.2843C1.87234 23.7393 2.04495 24.1757 2.35219 24.4975C2.65943 24.8192 3.07613 25 3.51064 25H18.4894C18.9239 25 19.3406 24.8192 19.6478 24.4975C19.9551 24.1757 20.1277 23.7393 20.1277 23.2843V5.39216H21.2979C21.4841 5.39216 21.6627 5.31469 21.7944 5.17679C21.926 5.0389 22 4.85187 22 4.65686C22 4.46185 21.926 4.27483 21.7944 4.13693C21.6627 3.99904 21.4841 3.92157 21.2979 3.92157ZM7.02128 2.69608C7.02128 2.37106 7.14457 2.05935 7.36402 1.82953C7.58348 1.5997 7.88113 1.47059 8.19149 1.47059H13.8085C14.1189 1.47059 14.4165 1.5997 14.636 1.82953C14.8554 2.05935 14.9787 2.37106 14.9787 2.69608V3.92157H7.02128V2.69608ZM18.7234 23.2843C18.7234 23.3493 18.6987 23.4117 18.6549 23.4576C18.611 23.5036 18.5514 23.5294 18.4894 23.5294H3.51064C3.44857 23.5294 3.38904 23.5036 3.34514 23.4576C3.30125 23.4117 3.2766 23.3493 3.2766 23.2843V5.39216H18.7234V23.2843ZM8.89362 10.5392V18.3824C8.89362 18.5774 8.81964 18.7644 8.68797 18.9023C8.55629 19.0402 8.3777 19.1176 8.19149 19.1176C8.00527 19.1176 7.82668 19.0402 7.69501 18.9023C7.56334 18.7644 7.48936 18.5774 7.48936 18.3824V10.5392C7.48936 10.3442 7.56334 10.1572 7.69501 10.0193C7.82668 9.88139 8.00527 9.80392 8.19149 9.80392C8.3777 9.80392 8.55629 9.88139 8.68797 10.0193C8.81964 10.1572 8.89362 10.3442 8.89362 10.5392ZM14.5106 10.5392V18.3824C14.5106 18.5774 14.4367 18.7644 14.305 18.9023C14.1733 19.0402 13.9947 19.1176 13.8085 19.1176C13.6223 19.1176 13.4437 19.0402 13.312 18.9023C13.1804 18.7644 13.1064 18.5774 13.1064 18.3824V10.5392C13.1064 10.3442 13.1804 10.1572 13.312 10.0193C13.4437 9.88139 13.6223 9.80392 13.8085 9.80392C13.9947 9.80392 14.1733 9.88139 14.305 10.0193C14.4367 10.1572 14.5106 10.3442 14.5106 10.5392Z"
                  fill="red"
                />
              </Svg>
            </TouchableOpacity>
          </ShowIf>

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.75}
            className="flex-1 h-16 rounded-lg bg-emerald-500 items-center justify-center"
          >
            <Text className="text-lg text-white">Salvar alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

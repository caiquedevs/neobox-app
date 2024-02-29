import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { ShowIf } from './ShowIf';
import { Path, Svg } from 'react-native-svg';
import { useGlobalContext } from '../context/GlobalContext';
import { createReplacement } from '../services/productService';
import { asyncStorage } from '../utils/storage';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useToast } from 'react-native-toast-notifications';

type Props = {};

export const BtnUpload = (props: Props) => {
  const storage = asyncStorage();
  const toast = useToast();

  const { network, verifyNetwork, cart, setCart, setReplacement } = useGlobalContext();

  const bgColor = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(132, 132, 132, ${bgColor.value})`,
    };
  });

  React.useEffect(() => {
    bgColor.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.cubic }), -1);
  }, []);

  const handlePressUpload = async () => {
    const connection = await verifyNetwork();
    if (!connection) return toast.show('Você precisa de internet para fazer essa ação!', { type: 'danger' });

    createReplacement(cart)
      .then((response) => {
        storage.remove('cart');
        setCart([]);
        setReplacement((old) => [...old, ...response]);
        toast.show('Compra anotada com sucesso, avise a loja para receber os produtos no sistema!', {
          type: 'success',
        });
      })
      .catch((err) => {
        toast.show('Houve um erro ao tentar realizar essa ação', { type: 'danger' });
      });
  };

  React.useEffect(() => {
    return () => {};
  }, []);

  return (
    <ShowIf
      show={network.ready && network.connection && cart && cart.length}
      className="w-16 h-16 absolute bottom-20 right-5"
    >
      <Pressable
        onPress={handlePressUpload}
        className="w-full h-full rounded-xl items-center justify-center bg-yellow-500 overflow-hidden"
      >
        <Animated.View style={[animatedStyle]} className="w-full h-full py-2 ">
          <Svg viewBox="0 0 20 20" fill="none">
            <Path
              d="M2.382 6.813V15.313C2.382 16.158 2.726 16.969 3.339 17.566C3.95716 18.1663 4.78533 18.5014 5.647 18.5H14.353C15.219 18.5 16.049 18.164 16.661 17.566C16.9628 17.2733 17.2029 16.9232 17.3673 16.5363C17.5317 16.1493 17.6169 15.7334 17.618 15.313V6.813M2.382 6.813C1.48 6.813 0.75 6.099 0.75 5.219V3.094C0.75 2.214 1.481 1.5 2.382 1.5H17.618C18.52 1.5 19.25 2.214 19.25 3.094V5.219C19.25 6.099 18.519 6.813 17.618 6.813M2.382 6.813H17.618"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path d="M10 10V15" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
            <Path
              d="M12.293 12.1033L10.326 10.1363C10.2834 10.0931 10.2327 10.0588 10.1767 10.0354C10.1207 10.012 10.0607 10 10 10C9.93937 10 9.87932 10.012 9.82336 10.0354C9.76739 10.0588 9.71664 10.0931 9.67403 10.1363L7.70703 12.1033"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </Animated.View>
      </Pressable>
    </ShowIf>
  );
};

import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Dimensions, TouchableOpacity, ViewProps, Pressable } from 'react-native';

import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface SwipeModalProps {
  openModal: (payload?: any) => void;
  closeModal: () => any;
  payload: any;
  setPayload: (payload: any) => void;
}

interface Props extends ViewProps {
  children: any;
  openPosition?: number;
  height: any;
  preventBackdrop?: boolean;
  preventSwipe?: boolean;
  hiddenBackdrop?: boolean;

  gestureEnd?: () => void;
  gestureStart?: () => void;
  callbackClose?: () => void;
  callbackOpen?: () => void;
}

const SwipeModal = ({ style, children, ...props }: Props, ref: ForwardedRef<SwipeModalProps | undefined>) => {
  const [payload, setPayload] = useState<any>(undefined);

  const heightDevice = Dimensions.get('screen').height;
  const openPosition = props.openPosition || 0;

  const posY = useSharedValue(heightDevice);
  const opacity = useSharedValue(0);
  const displayBackDrop = useSharedValue('none');

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      if (props.preventSwipe) return;
      if (props.gestureStart) runOnJS(props.gestureStart)();
    })
    .onUpdate((event) => {
      if (event.translationY < 0 || props.preventSwipe) return;
      posY.value = openPosition + event.translationY;
    })
    .onEnd((event) => {
      if (props.preventSwipe) return;

      if (event.translationY >= 50) {
        posY.value = withSpring(heightDevice, { damping: 100, stiffness: 1000 });
        opacity.value = withSpring(0, { damping: 100, stiffness: 1000 }, () => {
          displayBackDrop.value = 'none';
        });
      } else {
        posY.value = withSpring(openPosition, { damping: 100, stiffness: 1000 });
      }
    });

  const stylesAnimationModal = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: posY.value,
        },
      ],
    };
  });

  const stylesAnimationBackdrop = useAnimatedStyle(() => {
    return {
      opacity: Number(opacity.value),
      display: displayBackDrop.value as 'flex' | 'none',
    };
  });

  const openModal = (data?: any) => {
    if (displayBackDrop.value === 'flex') return;

    displayBackDrop.value = 'flex';
    posY.value = withSpring(openPosition, { damping: 100, stiffness: 1000 });
    opacity.value = withSpring(1, { damping: 100, stiffness: 1000 });

    if (data) setPayload(data);

    props.callbackOpen?.();
  };

  const closeModal = () => {
    if (displayBackDrop.value === 'none') return;

    posY.value = withSpring(heightDevice, { damping: 100, stiffness: 1000 });

    opacity.value = withSpring(0, { damping: 100, stiffness: 1000 }, () => {
      displayBackDrop.value = 'none';
    });

    setPayload(null);
    props.callbackClose?.();
  };

  const getPayload = () => {
    return payload;
  };

  useImperativeHandle(
    ref,
    () => ({
      openModal,
      closeModal,
      getPayload,
      payload,
      setPayload,
    }),
    [payload, props]
  );

  return (
    <Animated.View className="w-full h-full items-center absolute top-0 left-0 z-50" style={[stylesAnimationBackdrop]}>
      <Pressable onPress={closeModal} className="w-full h-full absolute top-0 left-0 bg-black/40" />

      <GestureDetector gesture={panGesture}>
        <Animated.View
          {...props}
          style={[{ height: props.height }, stylesAnimationModal, style]}
          className="w-full absolute bottom-0 left-0 rounded-t-3xl z-50"
        >
          <View className="w-full items-center -top-3.5">
            <View className="w-16 h-1.5 rounded-full bg-white " />
          </View>

          {children?.(payload)}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default forwardRef(SwipeModal);

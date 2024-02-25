import React from 'react';
import { View, Text, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Pressable } from 'react-native';
import Constants from 'expo-constants';

import Carousel from 'react-native-snap-carousel';
import { useGlobalContext } from '../context/GlobalContext';

export const CarouselSection = () => {
  const { activeIndex, setActiveIndex, config, handleChangeMarket } = useGlobalContext();

  const carouselRef = React.useRef<Carousel<any>>(null);
  const windowWidth = Dimensions.get('window').width;

  const handlePress = (index: number) => {
    carouselRef.current?.snapToItem(index);
  };

  const handleScrollCarousel = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = nativeEvent;
    const index = Math.round(contentOffset.x / (windowWidth / 2));

    if (index !== activeIndex) {
      handleChangeMarket(index);
      setActiveIndex(index);
    }
  };

  return (
    <View style={{ paddingTop: Constants.statusBarHeight }} className="bg-zinc-800 min-h-[114px]">
      <View className="min-h-[52px] pt-2 pb-3 items-center justify-center">
        <View style={{ width: windowWidth / 2.5 }} className="h-10 absolute top-4 bg-teal-700 rounded-3xl" />

        <Carousel
          ref={carouselRef}
          layout={'default'}
          vertical={false}
          data={config?.markets || []}
          sliderWidth={windowWidth}
          itemWidth={windowWidth / 2.5}
          onScroll={handleScrollCarousel}
          shouldOptimizeUpdates={true}
          inactiveSlideOpacity={1}
          enableSnap={true}
          renderItem={({ item, index }) => {
            return (
              <Pressable className="py-3 top-0.5" onPress={() => handlePress(index)}>
                <Text className="text-lg text-white text-center">{item}</Text>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

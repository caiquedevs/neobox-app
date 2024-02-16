import React from 'react';
import { Text, TextInput, View, Dimensions } from 'react-native';
import Constants from 'expo-constants';

import Carousel from 'react-native-snap-carousel';

type Props = {};

export default function App({}: Props) {
  const windowWidth = Dimensions.get('window').width;

  const [items, setItems] = React.useState({
    activeIndex: 0,
    carouselItems: [
      {
        title: 'Item 1',
        text: 'Text 1',
      },
      {
        title: 'Item 2',
        text: 'Text 2',
      },
      {
        title: 'Item 3',
        text: 'Text 3',
      },
      {
        title: 'Item 4',
        text: 'Text 4',
      },
      {
        title: 'Item 5',
        text: 'Text 5',
      },
    ],
  });

  return (
    <View style={{ paddingTop: Constants.statusBarHeight }} className="w-full flex-1 bg-slate-900">
      <View className="bg-blue-500">
        <Carousel
          layout={'default'}
          vertical={false}
          data={items.carouselItems}
          sliderWidth={windowWidth}
          itemWidth={300}
          onSnapToItem={(index) => setItems((old) => ({ ...old, activeIndex: index }))}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  backgroundColor: 'red',
                  borderRadius: 5,
                  height: 250,
                  padding: 50,
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <Text style={{ fontSize: 30 }}>{item.title}</Text>
                <Text>{item.text}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

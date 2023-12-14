import type {SharedValue} from 'react-native-reanimated';
import { useMemo, } from 'react'
import { Gesture, } from 'react-native-gesture-handler'
import { clamp, runOnJS, runOnRuntime, withDecay, } from 'react-native-reanimated'

import { dist, runDecay, SkiaMutableValue, SkiaValue, useTouchHandler, useValue, vec, } from '@shopify/react-native-skia'

export const useGraphTouchHandler = (x: SharedValue<number>, width: number) => {
  console.log('useGraphTouchHandler is executed');
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          //'worklet';
          //runOnJS(setIsVisiblePopup(true));
        })
        .onChange(pos => {
          x.value += pos.x;
          console.log(x.value);
        })
        .onEnd(({velocityX}) => {
          x.value = withDecay({velocity: velocityX, clamp: [0, width]});
        }),
    [width, x],
  );
  return gesture;
};

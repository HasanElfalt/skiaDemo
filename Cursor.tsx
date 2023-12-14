import React from 'react'
import { convertToRGBA, interpolateColor, useDerivedValue, } from 'react-native-reanimated'

import { Circle, Group, Paint, SkiaMutableValue, } from '@shopify/react-native-skia'

import { COLORS, } from '../Model'

import type {SharedValue} from 'react-native-reanimated';
interface CursorProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export const Cursor = ({x, y}: CursorProps) => {
  const transform = useDerivedValue(() => [
    {translateX: x.value},
    {translateY: y.value},
  ]);
  //console.log('Cursor' + x.current);
  return (
    <Group transform={transform}>
      {/* <Circle cx={0} cy={0} r={27} color={'blue'} opacity={0.15} />
      <Circle cx={0} cy={0} r={18} color={'blue'} opacity={0.15} /> */}
      <Circle cx={0} cy={0} r={5} color={'blue'}>
        <Paint style="stroke" strokeWidth={2} color="white" />
      </Circle>
    </Group>
  );
};

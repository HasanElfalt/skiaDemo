/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 *
 */

import React, { useEffect, useMemo, useState, } from 'react'
import { StatusBar, StyleSheet, useWindowDimensions, View, } from 'react-native'
import { GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, } from 'react-native-reanimated'

import { Canvas, Fill, Group, LinearGradient, Paint, Path, Text, vec, } from '@shopify/react-native-skia'

import { Cursor, } from './Cursor'
import { accountsReport, } from './Data'
import { curveLines, getYForX, } from './Math'
import { getGraph, PADDING, } from './Model'
import { Touch, } from './Touch'
import { useGraphTouchHandler, } from './useGraphTouchHandler'

interface GraphData {
  minAmount: number;
  maxAmount: number;
  //path: SkPath;
}

const touchableCursorSize = 80;

function App(): JSX.Element {
  const window = useWindowDimensions();
  const {width} = window;
  const height = 300; //Math.min(window.width, window.height) / 2;
  const AJUSTED_SIZE = height + PADDING;
  //const graphs = useMemo(() => getGraph(width, height), [width, height]);
  const translateY = PADDING;

  const makeGraph = (data: {date: Date; amount: number}[]) => {
    const minAmount: number = Math.min(...data.map(val => val.amount));
    const maxAmount = Math.max(...data.map(val => val.amount));

    const minDate = Math.min(...data.map(val => val.date.getTime()));
    const maxDate = Math.max(...data.map(val => val.date.getTime()));
    console.log('dddddddd');
    /*
    const getYAxis = scaleLinear().domain([0, max]).range([400, 35]);

    const getXAxis = scaleTime()
      .domain([new Date(2023, 10, 1), new Date(2023, 11, 30)])
      .range([1, 360]);

    const curvedLine = line()
      .x(d => getXAxis(new Date(d.date)))
      .y(d => getYAxis(d.amount))
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
*/
    const points = data.reverse().map(({date, amount}) => {
      console.log('width', width, 'height', height);
      console.log('date, amount', date, amount);
      const x = ((date.getTime() - minDate) / (maxDate - minDate)) * width;
      const y = ((amount - minAmount) / (maxAmount - minAmount)) * AJUSTED_SIZE;
      console.log('x, y', x, y);
      return {x, y};
    });
    //points.push({x: width, y: points[points.length - 1].y});
    console.log(points);
    const path = curveLines(points, 0.1, 'bezier');

    return {
      minAmount,
      maxAmount,
      minDate,
      maxDate,
      path,
    };
  };

  const graphData = makeGraph(accountsReport);
  const path = useDerivedValue(() => {
    return graphData.path;
    //return graphData.curve.interpolate(graphData.curve, 0);
    //return graphs[0].data.path;
  });

  // x and y values of the cursor
  const x = useSharedValue(0);
  const y = useDerivedValue(() => getYForX(path.value.toCmds(), x.value));
  const gesture = useGraphTouchHandler(x, width);
  // logs of x and y are not working
  useEffect(() => {
    //x.value = path.value.toCmds()[0].x;
    //y.value = path.value.toCmds()[0].y;
    console.log('x= ' + x.value);
    console.log('y= ' + y.value);
  });

  const format = (value: number) => {
    'worklet';
    return value.toString();
    //.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  };

  useEffect(() => {
    return () => {};
  }, []);

  function formatDate_convert_YYYY_MM_DD_to_DD_MMMM_YYYY(
    inputDate: number,
  ): string {
    'worklet';
    // Parse the input date in the "YYYY-MM-DD" format
    const dateObject = new Date(inputDate);

    const day = dateObject.getDate();
    const month = new Intl.DateTimeFormat('en', {month: 'long'}).format(
      dateObject,
    );
    const year = dateObject.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
  }

  const text0 = useDerivedValue(() => {
    return formatDate_convert_YYYY_MM_DD_to_DD_MMMM_YYYY(
      interpolate(x.value, [width, 0], [graphData.maxDate, graphData.minDate]),
    );
  }, [x.value]);

  const text1 = useDerivedValue(() => {
    return (
      format(
        interpolate(
          y.value,
          [AJUSTED_SIZE, 0],
          [graphData.maxAmount, graphData.minAmount],
        ).toFixed(3),
      ) + ' SAR'
    );
  }, [y.value]);

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: touchableCursorSize,
      height: touchableCursorSize,
      left: x.value, //- touchableCursorSize / 2,
      top: y.value, //- touchableCursorSize / 2,
    };
  });

  const transform = useDerivedValue(() => [
    {translateX: x.value},
    {translateY: y.value + 10},
  ]);

  const xValue = useDerivedValue(() => {
    const xVal = x.value;
    return xVal > 50 ? (xVal < width - 70 ? -50 : -120) : 0;
  });

  return (
    <GestureHandlerRootView>
      <View style={{alignItems: 'center'}}>
        <Canvas style={{height: 400, width: '100%'}}>
          <Group transform={[{translateY}, {scaleX: 1}, {scaleY: 1}]}>
            <Path path={path} color="#3386c3" strokeWidth={2} style="stroke" />
            <Cursor x={x} y={y} />
          </Group>
          <Group transform={transform}>
            <Text x={xValue} y={40} text={text0} color="#71717a" />
            <Text x={xValue} y={60} text={text1} color="#18181b" />
          </Group>
          <Text
            x={0}
            y={AJUSTED_SIZE + 50}
            text={'Transaction history'}
            color="#18181b"
          />
        </Canvas>
        <GestureDetector gesture={gesture}>
          <Animated.View style={style} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    zIndex: 1,
    position: 'absolute',
    marginTop: 24 + 35 + 4,
    marginHorizontal: 16,
    //right: isRTL() ? undefined : '0%',
    //left: isRTL() ? '0%' : undefined,
    borderRadius: 4,
    //backgroundColor: colors.app.fillColor,
    shadowColor: 'rgba(0, 0, 0, 0.02)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  wrapper_item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    //fontFamily: IFontFamily.bold,
    //color: colors.palette.navy,
    marginStart: 8,
    backgroundColor: 'red',
  },
});

export default App;

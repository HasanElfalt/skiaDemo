import React, { useCallback, } from 'react'
import { Pressable, } from 'react-native'

//import { debounce, } from 'underscore'

interface IProps {
  onPress: () => void;
  isDisabled?: boolean;
  style?: object;
  isNotDebounced?: boolean;
  children?: Element;
}

// https://reactnative.dev/docs/pressable
const Touch: React.FC<IProps> = ({
  onPress,
  isDisabled = false,
  style = {},
  children,
  isNotDebounced = false,
}) => {
  /*const onPressDebounced = useCallback(debounce(onPress, 1000, true), [
    onPress,
  ]);*/
  return (
    <Pressable
      onPress={onPress} // debounceTime in ms
      disabled={isDisabled}
      style={style}>
      {children}
    </Pressable>
  );
};

export {Touch};

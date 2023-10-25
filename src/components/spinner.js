import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '@ui-kitten/components';
import {Grid} from 'react-native-animated-spinkit';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export const Spinner = ({visible}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {display: visible ? 'flex' : 'none'}]}>
      <Grid size={60} color={theme['color-primary-700']} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000099',
    width: WIDTH,
    height: HEIGHT,
    top: 0,
    left: 0,
    zIndex: 10000,
  },
});

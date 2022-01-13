import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CallActionBox from '../../components/CallActionBox';

const CallScreen = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.cameraPreview}></View>
      <CallActionBox />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    width: 100,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#ffff6e',
    position: 'absolute',
    right: 10,
    top: 100,
  },
});

export default CallScreen;

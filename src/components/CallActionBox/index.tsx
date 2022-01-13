import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onHangUpPress: () => void;
}

const CallActionBox: React.FC<Props> = ({onHangUpPress}) => {
  const [isCameraOn, setIsCameraOn] = React.useState(true);
  const [isMicOn, setIsMicOn] = React.useState(true);

  const onReverseCamera = () => console.log('reverse_cam');
  const onToggleCamera = () => setIsCameraOn(!isCameraOn);
  const onToggleMicrophone = () => setIsMicOn(!isMicOn);

  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onReverseCamera} style={styles.iconButton}>
        <Ionicons name="ios-camera-reverse" size={30} color={'white'} />
      </Pressable>
      <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialIcons
          name={isCameraOn ? 'camera-off' : 'camera'}
          size={30}
          color={'white'}
        />
      </Pressable>
      <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialIcons
          name={isMicOn ? 'microphone-off' : 'microphone'}
          size={30}
          color={'white'}
        />
      </Pressable>
      <Pressable
        onPress={onHangUpPress}
        style={[styles.iconButton, {backgroundColor: 'red'}]}>
        <MaterialIcons name="phone-hangup" size={30} color={'white'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#333333',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 50,
  },
});

export default CallActionBox;

import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Voximplant} from 'react-native-voximplant';

type RootStackParamList = {
  IncomingCall: {call: any};
  Contacts: undefined;
  Calling: {call: any; isIncomingCall: boolean};
};

type Props = NativeStackScreenProps<RootStackParamList, 'IncomingCall'>;

const IncomingCallScreen: React.FC<Props> = ({navigation, route}) => {
  const [caller, setCaller] = React.useState('');
  const {call} = route.params;

  React.useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      navigation.navigate('Contacts');
    });
    return () => call.off(Voximplant.CallEvents.Disconnected);
  }, []);

  const onDecline = () => call.decline();

  const onAccept = () =>
    navigation.navigate('Calling', {
      call,
      isIncomingCall: true,
    });

  return (
    <ImageBackground
      style={styles.screen}
      source={require('../../../assets/images/ios_bg.png')}>
      <Text style={styles.name}>{caller}</Text>
      <Text style={styles.phoneNumber}>WhatsApp video...</Text>

      <View style={[styles.row, {marginTop: 'auto'}]}>
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" color="white" size={30} />
          <Text style={styles.iconText}>Remind Me</Text>
        </View>
        <View style={styles.iconContainer}>
          <Entypo name="message" color="white" size={30} />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Pressable onPress={onDecline} style={styles.iconContainer}>
          <View style={styles.iconButtonContainer}>
            <Feather name="x" color="white" size={40} />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </Pressable>
        <Pressable onPress={onAccept} style={styles.iconContainer}>
          <View
            style={[styles.iconButtonContainer, {backgroundColor: '#2e7bff'}]}>
            <Feather name="check" color="white" size={40} />
          </View>
          <Text style={styles.iconText}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 50,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 100,
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    margin: 10,
  },
});

export default IncomingCallScreen;

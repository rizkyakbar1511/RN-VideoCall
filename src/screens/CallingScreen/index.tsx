import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import CallActionBox from '../../components/CallActionBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Voximplant} from 'react-native-voximplant';

interface User {
  user_id: string;
  user_name: string;
  user_display_name: string;
}

type RootStackParamList = {
  Calling: {user: User; call: any; isIncomingCall: boolean};
  Contacts: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Calling'>;

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen: React.FC<Props> = ({navigation, route}) => {
  const [callStatus, setCallStatus] = React.useState('Initializing...');
  const [permissionGranted, setPermissionGranted] = React.useState(false);
  const [localVideoStreamId, setLocalVideoStreamId] = React.useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = React.useState('');

  const goBack = () => navigation.goBack();
  const {user, call: incomingCall, isIncomingCall} = route?.params;
  const call = React.useRef<any>(incomingCall);
  const endpoint = React.useRef<any>(null);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      (async () => {
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        if (!cameraGranted! || !recordAudioGranted) {
          Alert.alert('Permissions not granted');
        } else {
          setPermissionGranted(true);
        }
      })();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  React.useEffect(() => {
    if (!permissionGranted) return;
    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      call.current = await Voximplant.getInstance().call(
        user.user_name,
        callSettings,
      );
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvents();
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current?.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
        showError(callEvent.reason);
      });
      call.current?.on(
        Voximplant.CallEvents.ProgressToneStart,
        (callEvent: any) => {
          setCallStatus('Calling...');
        },
      );
      call.current?.on(Voximplant.CallEvents.Connected, (callEvent: any) => {
        setCallStatus('Conntected');
      });
      call.current?.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
        navigation.navigate('Contacts');
      });
      call.current?.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        (callEvent: any) => setLocalVideoStreamId(callEvent.videoStream.id),
      );
      call.current?.on(
        Voximplant.CallEvents.EndpointAdded,
        (callEvent: any) => {
          endpoint.current = callEvent.endpoint;
          subscribeToEndpointEvents();
        },
      );
    };

    const subscribeToEndpointEvents = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        (endpointEvent: any) =>
          setRemoteVideoStreamId(endpointEvent.videoStream.id),
      );
    };

    const showError = (reason: any) => {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('Contacts'),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current?.off(Voximplant.CallEvents.Failed);
      call.current?.off(Voximplant.CallEvents.ProgressToneStart);
      call.current?.off(Voximplant.CallEvents.Connected);
      call.current?.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionGranted]);

  const onHangUpPress = () => call.current?.hangup();

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backButton} onPress={goBack}>
        <Ionicons name="chevron-back" color="white" size={25} />
      </Pressable>

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
      />

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user?.user_display_name}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>
      <CallActionBox onHangUpPress={onHangUpPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 2,
  },
  localVideo: {
    width: 100,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#ffff6e',
    position: 'absolute',
    right: 10,
    top: 100,
  },
  remoteVideo: {
    borderRadius: 10,
    backgroundColor: '#ffff6e',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
  },
});

export default CallingScreen;

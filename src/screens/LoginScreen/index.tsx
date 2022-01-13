import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Voximplant} from 'react-native-voximplant';

import {APP_NAME, ACC_NAME} from '../../constants';

type RootStackParamList = {
  Login: undefined;
  Contacts: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const voximplant = Voximplant.getInstance();

  React.useEffect(() => {
    (async () => {
      const status = await voximplant.getClientState();
      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        navigation.reset({index: 0, routes: [{name: 'Contacts'}]});
      }
    })();
  }, []);

  const signIn = async () => {
    try {
      const fqUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      await voximplant.login(fqUsername, password);
      navigation.reset({index: 0, routes: [{name: 'Contacts'}]});
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.name, `Error code: ${error.code}`);
    }
  };
  return (
    <View style={styles.screen}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        style={styles.input}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default LoginScreen;

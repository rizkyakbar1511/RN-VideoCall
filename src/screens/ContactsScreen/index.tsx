import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Voximplant} from 'react-native-voximplant';

import dummyContacts from '../../../assets/data/contacts.json';

interface User {
  user_id: string;
  user_name: string;
  user_display_name: string;
}

type RootStackParamList = {
  Contacts: undefined;
  Calling: {user: User};
  IncomingCall: {call: any};
};

type Props = NativeStackScreenProps<RootStackParamList, 'Contacts'>;

const ContactsScreen: React.FC<Props> = ({navigation}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredContacts, setFilteredContacts] = React.useState(dummyContacts);
  const voximplant = Voximplant.getInstance();

  React.useEffect(() => {
    const newContacts = dummyContacts.filter(contact =>
      contact.user_display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredContacts(newContacts);
  }, [searchTerm]);

  React.useEffect(() => {
    voximplant.on(
      Voximplant.ClientEvents.IncomingCall,
      (incomingCallEvent: any) =>
        navigation.navigate('IncomingCall', {call: incomingCallEvent.call}),
    );
    return () => voximplant.off(Voximplant.ClientEvents.IncomingCall);
  }, []);

  const callUser = (user: User) => {
    navigation.navigate('Calling', {user});
  };

  return (
    <View style={styles.page}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
        placeholder="Search ..."
      />
      <FlatList
        data={filteredContacts}
        renderItem={({item}) => (
          <Pressable onPress={() => callUser(item)}>
            <Text style={styles.contactName}>{item.user_display_name}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
});

export default ContactsScreen;

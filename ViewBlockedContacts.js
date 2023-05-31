import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from 'react-native-elements';

export default class ViewBlockedContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
    };
  }

  componentDidMount() {
    this.loadContacts();
  }

  // load contacts which have been blocked 
  loadContacts = async () => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      };

      const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
        method: 'get',
        headers,
      });

      if (response.status === 200) {
        const responseJson = await response.json();
        this.setState({ contacts: responseJson });

        const storedUsers = await AsyncStorage.getItem("stored_users");
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        console.log(users);
      } else {
        Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // allow a user to view blocked contacts 
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.contacts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() => this.props.navigation.navigate('Unblock', { contact: item })}
            >
              <ListItem.Content>
                <ListItem.Title style={styles.listItemText}>{item.user_id}</ListItem.Title>
                <ListItem.Title style={styles.listItemText}>{item.first_name}</ListItem.Title>
                <ListItem.Title style={styles.listItemText}>{item.last_name}</ListItem.Title>
                <ListItem.Title style={styles.listItemText}>{item.email}</ListItem.Title>
              </ListItem.Content>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listItem: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  listItemText: {
    fontSize: 16,
    color: '#4A641E',
  },
});

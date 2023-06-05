import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      users: [],
      searchQuery: '',
      submitted: false,
    };
  }

  getUsers = async () => {
    if (this.state.searchQuery) {
      const url = `http://localhost:3333/api/1.0.0/search?q=${this.state.searchQuery}`;

      try {
        const response = await fetch(url, {
          method: 'get',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token"),
            'Content-Type': 'application/json'
          },
        });

        if (response.status === 200) {
          const responseJson = await response.json();
          console.log(responseJson);
          this.setState({ users: responseJson });
        } else if (response.status === 404) {
          throw 'got no friends';
        } else {
          Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // allow user to search for other users 
  handleSearch = (query) => {
    this.setState({ searchQuery: query }, () => {
      this.getUsers();
    });
  };

  // allow a user to add another user as a contact 
  addContact = async (user_id) => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      };

      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/contact`,
        {
          method: 'post',
          headers,
          body: JSON.stringify({
            user_id: user_id,
          }),
        }
      );

      if (response.status === 200) {
        const responseJson = await response.json();
        const user = {
          user_id: user_id,
          name: responseJson.name,
        };
        const storedUsers = await AsyncStorage.getItem("stored_users");
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        users.push(user);
        await AsyncStorage.setItem("stored_users", JSON.stringify(users));
        this.props.navigation.navigate("ViewContacts");
      } else {
        Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }]);
      }
      if (response.status === 4000) {
        throw "Cant add yourself as a contact"
      }
    } catch (error) {

    }
  }
  // allow user to search for users that can then be added as contacts  
  render() {
    return (
      <ScrollView>
        <View style={styles.FriendSec}>
          <TextInput
            style={styles.SearchBox}
            placeholder="Search for users..."
            onChangeText={this.handleSearch}
            value={this.state.searchQuery}
          />
          {this.state.searchQuery && this.state.users.map((user) => {
            return (
              <View style={styles.UserContainer} key={user.user_id}>
                <View style={{ alignItems: 'flex-start' }}>
                  <View>
                    <Text>{user.user_id}</Text>
                    <Text>{user.first_name} {user.last_name}</Text>
                    <Text>{user.email}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Button title="+" onPress={() => this.addContact(user.user_id)} />
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  FriendSec: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  UserContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  SearchBox: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

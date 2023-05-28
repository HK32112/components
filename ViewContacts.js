import React, { Component } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ViewContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      error: "",
      contacts: [],
      submitted: false
    };
  }

  componentDidMount() {
    this.loadContacts();
  }

  loadContacts = async () => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      };

      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
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

  deleteContact = async (user_id) => {
    this.setState({ submitted: true });
    this.setState({ error: "" });

    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      };

      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
        method: 'delete',
        headers,
      });

      const responseJson = await response.json();

      console.log("ContactDeleted: ", responseJson.token);
      this.loadContacts();
    } catch (error) {
      this.loadContacts();
    }
  };

  blockContact = async (user_id) => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      };

      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/block`,
        {
          method: 'post',
          headers,
          body: JSON.stringify({
            user_id: user_id,
          }),
        }
      );
      if (response.status === 4000) {
        throw "Can't block yourself as a contact";
      }

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
        this.props.navigation.navigate("ViewBlockedContacts");
      } else {
        Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }]);
      }
    } catch (error) {

    }
  };
  render() {
    return (
      <View>
        {this.state.contacts.map((item, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.first_name}, {item.last_name}, {item.user_id}</ListItem.Title>
              <View style={styles.loginbtn}>
                <Button
                  title="Delete Contact"
                  onPress={() => this.deleteContact(item.user_id)}
                  buttonStyle={styles.button}
                />
                <Button
                  title="Block Contact"
                  onPress={() => this.blockContact(item.user_id)}
                  buttonStyle={styles.button}
                />
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    color: '#4A641E',
    backgroundColor: '#A4B389',
    padding: 10,
    fontSize: 25,
  },
  formLabel: {
    fontSize: 15,
    color: '#4A641E',
  },
  email: {
    paddingVertical: 10,
  },
  password: {
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  error: {
    color: 'red',
  },
  listContainer: {
    padding: 20,
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
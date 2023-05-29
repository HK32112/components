import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AddChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chat_name: '',
      error: '',
      submitted: false,
      chats: [],
    };
  }

  componentDidMount() {
    this.loadChats();
  }

  loadChats = async () => {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
      const responseJson = await response.json();
      console.log(responseJson);
      this.setState({ chats: responseJson });
    } catch (error) {
      console.error(error);
    }
  };

  addChat = async () => {
    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!this.state.chat_name) {
      this.setState({ error: 'Must enter chat name' });
      return;
    }

    console.log('Chat: ' + this.state.chat_name + ' Added ');

    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      };

      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'post',
        headers,
        body: JSON.stringify({
          name: this.state.chat_name,
        }),
      });

      const responseJson = await response.json();

      console.log('ChatAdded: ', responseJson.token);
      this.loadChats();
    } catch (error) {
      console.error(error);
      this.loadChats();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Input
              label="Chat Name:"
              placeholder="Enter chat name"
              onChangeText={(chat_name) => this.setState({ chat_name })}
              value={this.state.chat_name}
            />
            {this.state.submitted && !this.state.chat_name && (
              <Text style={styles.error}>Chat name is required</Text>
            )}

            <Button
              title="Add Chat"
              buttonStyle={styles.button}
              onPress={this.addChat}
            />

            {this.state.error && (
              <Text style={styles.error}>{this.state.error}</Text>
            )}
          </View>

          <View style={styles.listContainer}>
            {this.state.chats.map((item) => (
              <ListItem
                key={item.chat_id.toString()}
                containerStyle={styles.listItem}
                onPress={() =>
                  this.props.navigation.navigate('SingleChat', {
                    chat_name: item.name,
                    chatID: item.chat_id,
                  })
                }
              >
                <ListItem.Content>
                  <ListItem.Title style={styles.listItemText}>
                    {item.name}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </View>
        </ScrollView>
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
  formLabel: {
    fontSize: 15,
    color: '#4A641E'
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4A641E'
  },
  error: {
    color: "red",
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


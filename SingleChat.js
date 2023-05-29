import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';

export default class SingleChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loading: true,
      new_message: "",
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  async getMessages() {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const chat_id = item.chat_id;
      console.log("Getting messages");
      const response = await fetch(`https://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        method: "GET",
        headers: {
          "X-Authorization": token
        }
      });

      if (response.status === 200) {
        const responseData = await response.json();
        this.setState({
          messages: responseData,
          loading: false
        });
      } else if (response.status === 401) {
        throw new Error("Not authenticated");
      } else if (response.status === 403) {
        throw new Error("Not allowed");
      } else if (response.status === 404) {
        throw new Error("Not there");
      } else {
        throw new Error("It's broken");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addMessage() {
    if (this.state.new_message === "") {
      console.log("Can't send empty message");
      return;
    }

    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const chat_id = 1;
    console.log("Adding message");

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message`, {
        method: "POST",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: this.state.new_message })
      });

      if (response.status === 200) {
        console.log("Added message");
        this.setState((prevState) => ({
          messages: [...prevState.messages, { message: this.state.new_message }],
          new_message: ""
        }));
      } else {
        throw new Error("Broken");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteMessage(messageID) {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const chat_id = 1;
    const message_id = 1;
    console.log("Deleting message");

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`, {
        method: "DELETE",
        headers: {
          "X-Authorization": token
        }
      });

      if (response.status === 200) {
        console.log("Deleted message");
        this.setState((prevState) => ({
          messages: prevState.messages.filter((message) => message.message_id !== messageID)
        }));
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={64}>
        <FlatList
          data={this.state.messages}
          keyExtractor={(_item, index) => index.toString()} // Use the index as the key
          renderItem={({ item }) => (
            <View style={styles.messageContainer} key={item.message_id}>
              <Text>{item.message}</Text>
              <Button
                title="Delete"
                onPress={() => this.deleteMessage(item.message_id)}
              />
            </View>
          )}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.new_message}
            onChangeText={(val) => this.setState({ new_message: val })}
          />
          <Button
            title="Send Message"
            onPress={() => this.addMessage()}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});







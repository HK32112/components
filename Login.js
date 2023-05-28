import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: 'KHA2556@gmail.com',
      password: 'ManchesterCity123@@@Mm',
      error: '',
      submitted: false,
    };
    this.loginbutton = this.loginbutton.bind(this);
  }

  loginbutton = async () => {
    console.log('HELLO');

    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: 'Must enter email and password' });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    const PASSWORD_REGEX = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
    if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
      return;
    }

    console.log('HERE:', this.state.email, this.state.password);

    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          email: this.state.email,
          password: this.state.password,
        },
      ),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'Invalid email or password';
        } else {
          throw 'Something wrent wrong';
        }
      })
      .then(async (rJson) => {
        console.log(rJson);
        try {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);

          this.setState({ submitted: false });

          this.props.navigation.navigate('MainAppNavigation');
        } catch {
          throw 'Something wrent wrong';
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Input
          label="Email:"
          placeholder="Enter email"
          onChangeText={(email) => this.setState({ email })}
          defaultValue={this.state.email}
        />
        {this.state.submitted && !this.state.email && (
          <Text style={styles.error}>Email is required</Text>
        )}

        <Input
          label="Password:"
          placeholder="Enter password"
          onChangeText={(password) => this.setState({ password })}
          defaultValue={this.state.password}
          secureTextEntry
        />
        {this.state.submitted && !this.state.password && (
          <Text style={styles.error}>Password is required</Text>
        )}

        {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}

        <Button
          title="Login"
          buttonStyle={styles.button}
          onPress={this.loginbutton}
        />

        <Button
          title="Register"
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate('Register')}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: '80%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#2196F3',
  },
  error: {
    color: 'red',
    fontWeight: '900',
    marginTop: 10,
  },
};
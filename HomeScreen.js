import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome to WhatsThat</Text>
        </View>
        <View style={styles.loginBtn}>
          <Button
            title="Login"
            buttonStyle={styles.button}
            onPress={() => this.props.navigation.navigate('Login')}
          />
          <Button
            title="Register"
            buttonStyle={styles.button}
            onPress={() => this.props.navigation.navigate('Register')}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  header: {
    fontSize: 40,
    color: 'black',
  },
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  button: {
    marginBottom: 30,
    backgroundColor: '#2196F3',
    width: 250,
    height: 50,
    borderRadius: 5,
  },
};
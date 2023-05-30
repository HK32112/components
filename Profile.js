import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            profileInformation: [],
            photo: '',
        };
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    };

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData();
            this.getProfilephoto();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    async getProfilephoto() {
        const id = await AsyncStorage.getItem('whatsthat_user_id');
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
            headers: {
                'X-Authorization': token,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    throw 'Something happened';
                }
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);

                this.setState({
                    photo: data,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }


    getData = async () => {
        return fetch(
            'http://localhost:3333/api/1.0.0/user/' +
            (await AsyncStorage.getItem('whatsthat_user_id')),
            {
                method: 'GET',
                headers: {
                    'X-Authorization': await AsyncStorage.getItem(
                        'whatsthat_session_token'
                    ),
                },
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    isLoading: false,
                    profileInformation: responseJson,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };


    logoutbutton = async () => {
        return fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'POST',
            headers: {
                'X-Authorization': await AsyncStorage.getItem(
                    'whatsthat_session_token'
                ),
            },
        })
            .then(async (response) => {
                if (response.status === 200) {
                    await AsyncStorage.removeItem('whatsthat_session_token');
                    await AsyncStorage.removeItem('whatsthat_user_id');
                    this.props.navigation.navigate('Login');
                } else if (response.status === 401) {
                    console.log('Unauthorized');
                    await AsyncStorage.removeItem('whatsthat_session_token');
                    await AsyncStorage.removeItem('whatsthat_user_id');
                    this.props.navigation.navigate('Login');
                } else {
                    throw 'Something went wrong';
                }
            })
            .catch((error) => {
                this.setState({ error: error });
                this.setState({ submitted: false });
            });
    };


    render() {
        if (this.state.isLoading) {
            return <Text>Loading...</Text>;
        } else {
            return (
                <View>
                    <Text>Profile</Text>
                    <Image
                        source={{
                            uri: this.state.photo,
                        }}
                        style={{
                            width: 150,
                            height: 150,
                            marginLeft: 10,
                        }}
                    />
                    <Text>
                        Welcome, {this.state.profileInformation.first_name} {this.state.profileInformation.last_name}
                    </Text>
                    <View>
                        <Button
                            title="Logout"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                            onPress={() => this.logoutbutton()}
                        />
                        <Button
                            title="Update Profile"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                            onPress={() => this.props.navigation.navigate('UpdateProfile')}
                        />
                        <Button
                            title="Upload Photo"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                            onPress={() => this.props.navigation.navigate('Camera')}
                        />
                        <Text style={styles.error}>{this.state.error}</Text>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '80%',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    button: {
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 30,
        backgroundColor: '#2196F3',
        width: 300,
    },
    buttonText: {
        textAlign: 'center',
        padding: 10,
        color: 'white',
    },
});
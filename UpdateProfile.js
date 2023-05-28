import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UpdateProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            updated_first_name: '',
            updated_last_name: '',
            error: '',
            submitted: false,
        };

        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    updateProfile = async () => {
        this.setState({ submitted: true });
        this.setState({ error: '' });
        let to_send = {};

        if (!this.state.updated_first_name) {
            this.setState({ error: 'Must enter first name' });
            return;
        }

        if (!this.state.updated_last_name) {
            this.setState({ error: 'Must enter last name' });
            return;
        } else {
            this.patchData();
        }
    };

    async getData() {
        return fetch('http://localhost:3333/api/1.0.0/user/' + (await AsyncStorage.getItem('whatsthat_user_id')),
            {
                method: 'GET',
                headers: {
                    'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
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
    }

    async patchData() {
        const to_send = {};
        if (this.state.profileInformation.first_name != this.state.updated_first_name) {
            to_send.first_name = this.state.updated_first_name;
        }

        if (this.state.profileInformation.last_name != this.state.updated_last_name) {
            to_send.last_name = this.state.updated_last_name;
        }

        return fetch(
            'http://localhost:3333/api/1.0.0/user/' +
            (await AsyncStorage.getItem('whatsthat_user_id')),
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
                },
                body: JSON.stringify(to_send),
            }
        )
            .then((response) => {
                console.log('Item updated');
                this.props.navigation.navigate('Profile');
            })
            .catch((error) => {
                console.log(error);
            });
    }



    render() {
        return (
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text>First Name:</Text>
                    <Input
                        style={styles.input}
                        placeholder="Enter first name"
                        onChangeText={(updated_first_name) => this.setState({ updated_first_name })}
                        value={this.state.updated_first_name}
                    />

                    {this.state.submitted && !this.state.updated_first_name && (
                        <Text style={styles.error}>Please enter first name</Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text>Last Name:</Text>
                    <Input
                        style={styles.input}
                        placeholder="Enter last name"
                        onChangeText={(updated_last_name) => this.setState({ updated_last_name })}
                        value={this.state.updated_last_name}
                    />

                    {this.state.submitted && !this.state.updated_last_name && (
                        <Text style={styles.error}>Please enter last name</Text>
                    )}
                </View>

                <View style={styles.signupbtn}>
                    <Button
                        title="Update Profile"
                        onPress={this.updateProfile}
                        buttonStyle={styles.button}
                    />
                    <Text style={styles.error}>{this.state.error}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: 200,
    },
    error: {
        color: 'red',
        fontWeight: '900',
    },
    button: {
        backgroundColor: '#2196F3',
        marginTop: 20,
        width: 200,
    },
});
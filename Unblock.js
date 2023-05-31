import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Unblock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: '',
            error: '',
            submitted: false,
        };

        this.unblockContact = this.unblockContact.bind(this);
    }

    //unblock user 
    unblockContact = async () => {
        this.setState({ submitted: true });
        this.setState({ error: '' });

        if (!this.state.user_id) {
            this.setState({ error: '*Must enter user id field' });
            return;
        }

        console.log('Contact: ' + this.state.user_id + ' Unblocked ');

        try {
            const token = await AsyncStorage.getItem('whatsthat_session_token');
            const headers = {
                'Content-Type': 'application/json',
                'X-Authorization': token,
            };

            const response = await fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/block',
                {
                    method: 'DELETE',
                    headers,
                    body: JSON.stringify({
                        user_id: this.state.user_id,
                    }),
                }
            );

            const responseJson = await response.json();

            console.log('User Unblocked: ', responseJson.token);
        } catch (error) {
            console.log(error);
        }
    };

    // allow user to unblock a user given their user id 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.user_id_input}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter user_id"
                            onChangeText={(user_id) => this.setState({ user_id })}
                            defaultValue={this.state.user_id}
                        />

                        {this.state.submitted && !this.state.user_id && (
                            <Text style={styles.error}>*user_id is required</Text>
                        )}
                    </View>

                    <View>
                        <Button
                            title="Unblock Contact"
                            onPress={() => this.unblockContact()}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                        />
                    </View>

                    {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
                </View>
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
    user_id_input: {
        paddingVertical: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
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
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    error: {
        color: 'red',
    },
});
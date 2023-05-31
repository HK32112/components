import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as EmailValidator from 'email-validator';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            error: '',
            submitted: false,
        };

        this.registerbutton = this.registerbutton.bind(this);
    }

    // allow user to create an account and ask them to enter first name, last name, email address and password when doing so which will be validated and authenticated 
    registerbutton = () => {
        this.setState({ submitted: true });
        this.setState({ error: '' });

        if (!this.state.first_name) {
            this.setState({ error: 'Must enter first name' });
            return;
        }

        if (!this.state.last_name) {
            this.setState({ error: 'Must enter last name' });
            return;
        }

        if (!this.state.email || !this.state.password) {
            this.setState({ error: 'Must enter email and password' });
            return;
        }

        if (!EmailValidator.validate(this.state.email)) {
            this.setState({ error: 'Must enter valid email' });
            return;
        }

        const PASSWORD_REGEX = new RegExp(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        );
        if (!PASSWORD_REGEX.test(this.state.password)) {
            this.setState({
                error:
                    "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)",
            });
            return;
        }
        if (this.state.password !== this.state.confirm_password) {
            this.setState({ error: "Password isn't matching" });
            return;
        }

        console.log('HERE:', this.state.email, this.state.password);

        return fetch('http://localhost:3333/api/1.0.0/user', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((response) => {
                if (response.status === 201) return response.json();
                if (response.status === 500) {
                    throw 'Server error';
                } else if (response.status === 400) {
                    throw "Email already exists or password isn't strong enough";
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((rJson) => {
                console.log('User created with ID: ', rJson);
                this.setState({ error: 'User added successfully' });
                this.setState({ submitted: false });
                this.props.navigation.navigate('Login');
            })
            .catch((error) => {
                this.setState({ error: error });
                this.setState({ submitted: false });
            });
    };


    // render registration form which allows user to create an account 
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter first name"
                    onChangeText={(first_name) => this.setState({ first_name })}
                    defaultValue={this.state.first_name}
                />
                {this.state.submitted && !this.state.first_name && (
                    <Text style={styles.error}>Please enter first name</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Enter last name"
                    onChangeText={(last_name) => this.setState({ last_name })}
                    defaultValue={this.state.last_name}
                />
                {this.state.submitted && !this.state.last_name && (
                    <Text style={styles.error}>Please enter last name</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    onChangeText={(email) => this.setState({ email })}
                    defaultValue={this.state.email}
                />
                {this.state.submitted && !this.state.email && (
                    <Text style={styles.error}>Please enter an email</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    onChangeText={(password) => this.setState({ password })}
                    defaultValue={this.state.password}
                    secureTextEntry
                />
                {this.state.submitted && !this.state.password && (
                    <Text style={styles.error}>Please enter a password</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    onChangeText={(confirm_password) => this.setState({ confirm_password })}
                    defaultValue={this.state.confirm_password}
                    secureTextEntry
                />
                {this.state.submitted && !this.state.confirm_password && (
                    <Text style={styles.error}>Please confirm your password</Text>
                )}

                <Button
                    title="Sign Up"
                    onPress={this.registerbutton}
                    buttonStyle={styles.button}
                />
                <Text style={styles.error}>{this.state.error}</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        width: '100%',
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        marginBottom: 30,
    },
    error: {
        color: 'red',
        fontWeight: '900',
    },
});








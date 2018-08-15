import React from 'react';
import SocketIOClient from 'socket.io-client';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';

import Chat from './components/Chat';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userId: '',
			loading: true,
		}
		this.socket = SocketIOClient('http://192.168.4.146:1337');
	}

	determineUser() {
		AsyncStorage.getItem('userId')
			.then((userId) => {
				if (userId) {
					this.socket.emit('confirm user id', userId);
					this.socket.on('user id confirmation', response => {
						if (response.success) {
							this.setState({
								userId: response.userId,
								loading: false,
							})
						}
					})
				}
				else {
					this.socket.emit('request user id');
					this.socket.on('new user id', response => {
						console.log(response);
						if (response.success) {
							AsyncStorage.setItem('userId', response.userId);
							this.setState({
								userId: response.userId,
								loading: false,
							})
						}
					})
				}
			})
	}

	componentDidMount() {
		this.determineUser();
	}

  render() {
		const { userId } = this.state;
    return (
      <View style={styles.container}>
				{this.state.loading ? <Text>Loading</Text> : <Chat userId={userId}/>}
			</View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
		flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
		justifyContent: 'center',
  },
});

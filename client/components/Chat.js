import React from 'react';
import SocketIOClient from 'socket.io-client';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, ScrollView } from 'react-native';

import Message from './Message';

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			text: '',
		}

		this.socket = SocketIOClient('http://192.168.4.146:1337');
	}

	componentDidMount() {
		this.socket.emit('get chat messages');
		this.socket.on('all messages', messages => {
			this.setState({
				messages: messages,
			});
		})

		this.socket.on('chat message', message => {
			this.setState({
				messages: [...this.state.messages, message],
			});
		})
	}

	sendMessage(message) {
		const data = {
			message: message,
			date: Date.now(),
			sender: this.props.userId,
		};

		this.socket.emit('chat message', data);
		this.setState({
			text: '',
		})
	}

  render() {
		const messages = this.state.messages.map((message, index) => <Message key={index} text={message.message} date={message.date} />);
    return (
      <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>
				<View style={styles.messagesContainer}>
					<ScrollView
						ref={ref => this.scrollView = ref}
						onContentSizeChange={ (contentWidth, contentHeight) => {
							this.scrollView.scrollToEnd({ animated: true })
						} }
						contentContainerStyle={styles.messages}>
						{messages}
					</ScrollView>
				</View>
				<View style={styles.messageUi}>
					<TextInput style={styles.textInput} underlineColorAndroid='transparent' value={this.state.text} onChangeText={(text) => this.setState({text: text})}/>
					<Button style={styles.sendButton} color={'#88e57b'} onPress={() => this.sendMessage(this.state.text)} title='send'/>
				</View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
		justifyContent: 'flex-start',
  },
	messagesContainer: {
		alignSelf: 'stretch',
		flex: 1,
		alignItems: 'stretch',
		paddingTop: 50,
	},
	messages: {
		alignSelf: 'stretch',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	messageUi : {
		flex: 0.05,
		flexDirection: 'row',
		margin: 3,
		marginBottom: 5,
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ade0a6',
		borderRadius: 5,
		marginRight: 1,
	},
	sendButton: {
		borderWidth: 1,
		borderColor: '#ade0a6',
		borderRadius: 5,
	}
});

import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, ScrollView } from 'react-native';

export default class Message extends React.Component {

  render() {
		const date = new Date(this.props.date);
		const timeStamp = date.getHours() + ':' + date.getMinutes();
		console.log(date);
    return (
      <View style={styles.message}>
				<Text style={styles.timeStamp}>{timeStamp}</Text>
				<Text style={styles.messageText}>{this.props.text}</Text>
			</View>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    backgroundColor: '#c9ffc1',
		margin: 5,
		padding: 5,
		borderWidth: 1,
		borderColor: '#ade0a6',
		borderRadius: 5,
  },
	messageText: {
		fontSize: 18,
	},
	timeStamp: {
		opacity: 0.5,
	}
});

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

const dbConfig = require('./config/database.config.js');

// Configuring the database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
	.then(() => {
		console.log('Successfully connected to the database');
	}).catch(err => {
		console.log('Could not connect to the database.', err);
		process.exit();
	});

/*
* Import models
*/
const User = require('/models/user.model.js');
const Message = require('./models/message.model.js');

function generateId() {
	return 'user-' + Math.random().toString(36).substr(2, 16);
}

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log('user connected');

	/*
	* Provide a userId for a new user and create db entry
	*/
	socket.on('request user id', () => {
		const response = {
			userId: '',
			success: false,
			error: '',
		}

		const userId = generateId();

		const newUser = new User({ userId: userId });

		newUser.save((error) => {
			if (error) {
				response.error = error;
			}
			else {
				response.userId = userId;
				response.success = true;
			}
		});
		socket.emit('new user id', response);
	});

	// Confirm the userId of an existing userId
	socket.on('confirm user id', userId => {
		const response = {
			userId: '',
			success: false,
		}
		// TODO: check from db
		response.userId = userId;
		response.success = true;
		//
		socket.emit('user id confirmation', response);
	})

	socket.on('get chat messages', () => {
		Message.find().then(messages => socket.emit('all messages', messages));
	});

	socket.on('chat message', (data) => {
		const message = new Message({
			message: data.message,
			sender: data.sender,
			date: data.date,
		});
		message.save((error) => {
			if (error) {
				console.log(error);
			}
		})
		io.emit('chat message', data);
	});
});

http.listen(1337, () => {
	console.log('Listening on *:1337');
});

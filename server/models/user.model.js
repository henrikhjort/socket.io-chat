const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	userId: String
}, {
	timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);

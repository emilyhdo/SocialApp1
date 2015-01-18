var mongoose = require('mongoose');

mongoose.connect('mongodb://bricksquad:bricksquad@ds031601.mongolab.com:31601/socialapp');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connected to MongoDB');
});

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

var Users = mongoose.model('users', userSchema);

exports.Users = Users;

var messageSchema = mongoose.Schema({
    fromUser: String,
    toUser: String,
    message: String
});

var Messages = mongoose.model('messages', messageSchema);

exports.Messages = Messages;
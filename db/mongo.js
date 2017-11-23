var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/poke', function (err) {
	if (err && err.message.includes('ECONNREFUSED')) {
		console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
		process.exit(0);
	} else if (err) {
		throw err;
	} else {
		console.log('DB successfully connected');
	}
});

var db = mongoose.connection;

var playersSchema = new mongoose.Schema({
	name: String,
	vals: String
});

var Player = mongoose.model('Player', playersSchema);

module.exports = {
	Players: Player,
	mongoose: mongoose
}
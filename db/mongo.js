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



var PokemonSchema = new mongoose.Schema({
	id: Number,
	level: Number,
	trainer: String,
	moveset: [String]
	
});

var TrainerSchema = new mongoose.Schema({
	name: String,
	prim: PokemonSchema,
	seco: PokemonSchema,
	battles: Number
});



var Pokemon = mongoose.model('Pokemon', PokemonSchema);
var Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = {
	Pokemon: Pokemon,
	Trainer: Trainer,
	mongoose: mongoose
}
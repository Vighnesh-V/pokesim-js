//'use-strict';
var pokedex = require('./dex.json').data;
var movedex = require('./movedex.json');

function generateMoveset (learnables, level) {
	var possible = learnables.filter(function (move) {
		return move.level <= level;
	});

	var shuffled = possible.sort(() => .5 - Math.random());// shuffle  
 	var selected =shuffled.slice(0,4) ; //get sub-array of first n elements AFTER shuffle
 	return selected;
}

var Pokemon = function Pokemon(trainer,ID) {
	this.level = 5;
	this.trainer = trainer;
	console.log(pokedex[ID].learnable);
	var learnables = pokedex[ID].learnable;
	learnables = learnables.filter(function (move) {
		if (movedex[move.move] === undefined) {
			return false;
		} else {
			return true;
		}
	});
	this.learnable = learnables;
	this.evolutions = pokedex[ID].evos;
	this.bstats = pokedex[ID].bstats;
	this.name = pokedex[ID].name;
	this.id = ID;
	this.types = pokedex[ID].types
	this.moveset = generateMoveset(this.learnable, this.level);

} 

module.exports = Pokemon;

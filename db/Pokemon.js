//'use-strict';
var pokedex = require('./dex.json').data;
var movedex = require('./movedex.json');

function generateMoveset (learnables, level) {
	var possible = learnables.filter(function (move) {
		return (move.level <= level + 7);
	});

	var shuffled = possible.sort(() => .5 - Math.random());// shuffle  
 	var selected =shuffled.slice(0,4) ; //get sub-array of first n elements AFTER shuffle
 	return selected;
}

var Pokemon = function Pokemon(trainer,ID) {
	this.level = 5;
	this.trainer = trainer;
	var learnables = pokedex[ID - 1].learnable;
	learnables = learnables.filter(function (move) {
		if (movedex[move.move] === undefined) {
			return false;
		} else {
			return true;
		}
	});
	this.learnable = learnables;
	this.evolutions = pokedex[ID-1].evos;
	this.bstats = pokedex[ID-1].bstats;
	this.name = pokedex[ID-1].name;
	this.id = ID;
	this.types = pokedex[ID-1].types
	this.moveset = generateMoveset(this.learnable, this.level);

} 


module.exports = Pokemon;

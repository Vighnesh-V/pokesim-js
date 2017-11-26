
const Normal = {
	b: ["Normal", "Fighting", "Flying", "Poison", "Ground", "Bug", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon"],
	c: [],
	a: ["Ghost"],
	d: ["Rock"] 
};

const Fighting = {
	a: ["Ghost"],
	b: ["Fight", "Ground", "Fire", "Water", "Grass", "Electric", "Dragon"],
	c: ["Normal", "Rock", "Ice"],
	d: ["Flying", "Poison", "Bug", "Psychic"]
};

const Flying = {
	a: [],
	b: ["Normal", "Flying", "Poison", "Ground", "Ghost", "Fire", "Water", "Psychic", "Ice", "Dragon"],
	c: ["Fighting", "Bug", "Grass"],
	d: ["Rock", "Electric"]
};

const Poison = {
	a: [],
	b: ["Normal", "Fighting", "Flying", "Fire", "Water", "Electric", "Psychic", "Ice", "Dragon"],
	c: ["Bug", "Grass"],
	d: ["Poison", "Ground", "Rock", "Ghost"]
};

const Ground = {
	a: ["Flying"],
	b: ["Normal", "Fighting", "Ground", "Ghost", "Water", "Psychic", "Ice", "Dragon"],
	c: ["Poison", "Rock", "Fire", "Electric"],
	d: ["Bug", "Grass"]
};

const Rock = {
	a: [],
	b: ["Normal", "Poison", "Rock", "Ghost", "Water", "Grass", "Electric", "Psychic", "Dragon"],
	c: ["Flying", "Bug", "Fire", "Ice"],
	d: ["Fighting", "Ground"]
};

const Bug = {
	a: [],
	b: ["Normal", "Ground", "Rock", "Bug", "Water", "Electric", "Ice", "Dragon"],
	c: ["Poison", "Grass", "Psychic"],
	d: ["Fighting", "Flying", "Ghost", "Fire"]
};

const Ghost = {
	a: ["Normal", "Psychic"],
	b: ["Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon" ],
	c: ["Ghost"],
	d: []
};

const Fire = {
	a: [],
	b: ["Normal", "Fighting", "Flying", "Poison", "Ground", "Ghost", "Electric", "Psychic"],
	c: ["Bug", "Grass", "Ice"],
	d: ["Rock", "Fire", "Water", "Dragon"]
};

const Water = {
	a: [],
	b: ["Normal", "Fighting", "Flying", "Poison", "Bug", "Ghost", "Electric", "Psychic", "Ice"],
	c: ["Ground", "Rock", "Fire"],
	d: ["Water", "Grass", "Dragon"]
};

const Grass = {
	a: [],
	b: ["Normal", "Fighting", "Ghost", "Electric", "Psychic", "Ice"],
	c: ["Ground", "Rock", "Water"],
	d: ["Flying", "Poison", "Bug", "Fire", "Grass", "Dragon"]
};

const Electric = {
	a: ["Ground"],
	b: ["Normal", "Fighting", "Poison", "Rock", "Bug", "Ghost", "Fire", "Psychic", "Ice"],
	c: ["Flying", "Water"],
	d: ["Grass", "Electric", "Dragon"]
};

const Psychic = {
	a: [],
	b: ["Normal", "Flying", "Ground", "Rock", "Bug", "Ghost", "Fire", "Water", "Grass", "Electric", "Ice", "Dragon"],
	c: ["Fighting", "Poison"],
	d: ["Fire", "Ice"]
};

const Ice = {
	a: [],
	b: ["Normal", "Fighting", "Poison", "Rock", "Bug", "Ghost", "Fire", "Electric", "Psychic"],
	c: ["Flying", "Ground", "Grass", "Dragon"],
	d: ["Water", "Psychic"]
};

const Dragon = {
	a: [],
	b: ["Normal", "Fighting", "Poison", "Rock", "Bug", "Ghost", "Fire", "Electric", "Psychic", "Flying", "Ground", "Grass", "Water", "Psychic"],
	c: ["Dragon"],
	d: []
};

const strength = {
	"Normal": Normal,
	"Fighting": Fighting,
	"Flying": Flying,
	"Poison": Poison,
	"Ground": Ground,
	"Rock": Rock,
	"Bug": Bug,
	"Ghost": Ghost,
	"Fire": Fire,
	"Water": Water,
	"Grass": Grass,
	"Electric": Electric,
	"Psychic": Psychic,
	"Ice": Ice,
	"Dragon": Dragon
};


function includes (elt, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elt) {
            return true;
        }
    }

    return false;
}
var TYPE = function (at, defender) {
	var x = []; 
	for (var i = 0; i < defender.length; i++) {
		console.log(strength[at]);
		if (includes(strength[at].a, defender[i])) {
			x.push(0);
		} else if (includes(strength[at].b, defender[i])) {
			x.push(1);
		} else if (includes(strength[at].c, defender[i])) {
			x.push(2);
		} else {
			x.push(0.5);
		}
	}

	var y = 1;
	for (var i = 0; i < x.length; i++) {
		y = y * x[i];
	}

	return y;
};



module.exports = {
	Normal: Normal,
	Fighting: Fighting,
	"Flying": Flying,
	"Poison": Poison,
	"Ground": Ground,
	"Rock": Rock,
	"Bug": Bug,
	"Ghost": Ghost,
	"Fire": Fire,
	"Water": Water,
	"Grass": Grass,
	"Electric": Electric,
	"Psychic": Psychic,
	"Ice": Ice,
	"Dragon": Dragon
}
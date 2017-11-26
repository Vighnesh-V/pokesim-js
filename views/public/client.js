// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */
var movesMade = 0;
var toSend = {};
$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  /*begin*/
var Normal = {
    b: ["Normal", "Fighting", "Flying", "Poison", "Ground", "Bug", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon"],
    c: [],
    a: ["Ghost"],
    d: ["Rock"] 
};

var Fighting = {
    a: ["Ghost"],
    b: ["Fight", "Ground", "Fire", "Water", "Grass", "Electric", "Dragon"],
    c: ["Normal", "Rock", "Ice"],
    d: ["Flying", "Poison", "Bug", "Psychic"]
};

var Flying = {
    a: [],
    b: ["Normal", "Flying", "Poison", "Ground", "Ghost", "Fire", "Water", "Psychic", "Ice", "Dragon"],
    c: ["Fighting", "Bug", "Grass"],
    d: ["Rock", "Electric"]
};

var Poison = {
    a: [],
    b: ["Normal", "Fighting", "Flying", "Fire", "Water", "Electric", "Psychic", "Ice", "Dragon"],
    c: ["Bug", "Grass"],
    d: ["Poison", "Ground", "Rock", "Ghost"]
};

var Ground = {
    a: ["Flying"],
    b: ["Normal", "Fighting", "Ground", "Ghost", "Water", "Psychic", "Ice", "Dragon"],
    c: ["Poison", "Rock", "Fire", "Electric"],
    d: ["Bug", "Grass"]
};

var Rock = {
    a: [],
    b: ["Normal", "Poison", "Rock", "Ghost", "Water", "Grass", "Electric", "Psychic", "Dragon"],
    c: ["Flying", "Bug", "Fire", "Ice"],
    d: ["Fighting", "Ground"]
};

var Bug = {
    a: [],
    b: ["Normal", "Ground", "Rock", "Bug", "Water", "Electric", "Ice", "Dragon"],
    c: ["Poison", "Grass", "Psychic"],
    d: ["Fighting", "Flying", "Ghost", "Fire"]
};

var Ghost = {
    a: ["Normal", "Psychic"],
    b: ["Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon" ],
    c: ["Ghost"],
    d: []
};

var Fire = {
    a: [],
    b: ["Normal", "Fighting", "Flying", "Poison", "Ground", "Ghost", "Electric", "Psychic"],
    c: ["Bug", "Grass", "Ice"],
    d: ["Rock", "Fire", "Water", "Dragon"]
};

var Water = {
    a: [],
    b: ["Normal", "Fighting", "Flying", "Poison", "Bug", "Ghost", "Electric", "Psychic", "Ice"],
    c: ["Ground", "Rock", "Fire"],
    d: ["Water", "Grass", "Dragon"]
};

var Grass = {
    a: [],
    b: ["Normal", "Fighting", "Ghost", "Electric", "Psychic", "Ice"],
    c: ["Ground", "Rock", "Water"],
    d: ["Flying", "Poison", "Bug", "Fire", "Grass", "Dragon"]
};

var Electric = {
    a: ["Ground"],
    b: ["Normal", "Fighting", "Poison", "Rock", "Bug", "Ghost", "Fire", "Psychic", "Ice"],
    c: ["Flying", "Water"],
    d: ["Grass", "Electric", "Dragon"]
};

var Psychic = {
    a: [],
    b: ["Normal", "Flying", "Ground", "Rock", "Bug", "Ghost", "Fire", "Water", "Grass", "Electric", "Ice", "Dragon"],
    c: ["Fighting", "Poison"],
    d: ["Fire", "Ice"]
};

var Ice = {
    a: [],
    b: ["Normal", "Fighting", "Poison", "Rock", "Bug", "Ghost", "Fire", "Electric", "Psychic"],
    c: ["Flying", "Ground", "Grass", "Dragon"],
    d: ["Water", "Psychic"]
};

var Dragon = {
    a: [],
    b: ["Normal", "Fighting", "Poison", "Rock", "Bug", "Ghost", "Fire", "Electric", "Psychic", "Flying", "Ground", "Grass", "Water", "Psychic"],
    c: ["Dragon"],
    d: []
};

var strength = {
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

var Type = function (at, defender) {
    var x = []; 
    for (var i = 0; i < defender.length; i++) {
        if (strength[at]["a"].indexOf(defender[i]) > -1) {
          x.push(0);
        } else if (strength[at]["b"].indexOf(defender[i]) > -1) {
          x.push(1);
        } else if (strength[at]["c"].indexOf(defender[i]) > -1) {
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

var DMG = function(Level, Power, A, D, STAB, Type) {
    return (((2 * Level / 5 + 2) * Power * (A / D))/ 50 + 2) * modifier(STAB, Type);
};
var modifier = function (STAB, Type) {return STAB * Type * (Math.random() * (0.15) + 0.85)};



  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);


  window.socket.on('connect', function () {
    console.log('Connected to server!');
    var user = $('h2').text();
    console.log(user);
    window.socket.emit('login', {name: user});
    $('#linker').hide();

  });

  $('#switch').on('click', function(){
    console.log('clicked');
    var x = $('h2').text();
    window.socket.emit('message', {msg: x});
  });

  window.socket.on('message', function(data) {
    console.log('Received: ' + data.msg);
  });

  window.socket.on('chat start', function (data) {
    console.log(data);
  });

  window.socket.on('populate', function (data) {
    var yourFilePath = data.you.toString();
    var myFilePath = data.me.toString();
    $('#front').data('id', data.you);
    $('#back').data('id', data.me);

    yourFilePath = '/public/front/' + yourFilePath + '.gif';
    myFilePath = '/public/back/' + myFilePath + '.png';

    $('#front').attr('src', yourFilePath);
    $('#back').attr('src', myFilePath);

    var myMoveSet = data.mem;
    $('#m1').text(myMoveSet[0]);
    $('#m2').text(myMoveSet[1]);
    $('#m3').text(myMoveSet[2]);
    $('#m4').text(myMoveSet[3]);

    $('#enemytext').text(data.youn);
    $('#playertext').text(data.men);

  });

  window.socket.on('increment', function (data) {
    movesMade = movesMade + 1;
    toSend = data;
  });

  window.socket.on('update-health', function (data) {
    //working out damage dealt to them
    var typeBonus = Type(data.them.attackingtype, data.them.deftype);
    var dmg = DMG(data.them.level, data.them.power, data.them.atk, data.them.def, data.them.stab, typeBonus);

    var percentHealth = Number($('#enemyhealth').data('health'));

    var curHealth = data.them.hp * (percentHealth / 100);
    var newHealth = Math.floor((curHealth - dmg) / data.them.hp * 100);
    console.log(percentHealth);
    console.log(curHealth);
    console.log(dmg);
    console.log(newHealth);
    $('#enemyhealth').data('health', newHealth);
    var newhstr = newHealth + '%'; 

    $('#enemyhealth').width(newhstr);

    //working out damage dealt to me
    var typeBonus1 = Type(data.me.attackingtype, data.me.deftype);
    var dmg1 = DMG(data.me.level, data.me.power, data.me.atk, data.me.def, data.me.stab, typeBonus1);
    var percentHealth1 = Number($('#playerhealth').data('health'));
    var curHealth1 = data.me.hp * percentHealth1 / 100;
    var newHealth1 = Math.floor((curHealth1 - dmg1) / data.me.hp * 100);
    $('#playerhealth').data('health', newHealth1);
    var newhstr1 = newHealth1 + '%'; 
    $('#playerhealth').width(newhstr1);
    //
    movesMade = 0;
    toSend = {};
    console.log('updated');

    $('#m1').prop('disabled', false);
    $('#m2').prop('disabled', false);
    $('#m3').prop('disabled', false);
    $('#m4').prop('disabled', false);
    $('#switch').prop('disabled', false);

  });

  $('#m1').on('click', function () {
    $('#m1').prop('disabled', true);
    $('#m2').prop('disabled', true);
    $('#m3').prop('disabled', true);
    $('#m4').prop('disabled', true);
    if (!(Number($('#m1').data('pp')) - 1 < 0)) {
      var newPP = Number($('#m1').data('pp')) - 1;
      $('#m1').data('pp', newPP);


      var moveName = $('#m1').text();
      var me = Number($('#back').data('id'));
      var you = Number($('#front').data('id'));
      var user = $('h2').text();
      var percentHealth = Number($('#enemyhealth').data("health"));
      movesMade = movesMade + 1;
      window.socket.emit('move', {
        sender: user,
        mypoke: me,
        yourpoke: you,
        hishealth: percentHealth,
        move: moveName,
        numMovesMade: movesMade,
        otherMove: toSend
      });
    } 
  });

  $('#m2').on('click', function () {
    $('#m1').prop('disabled', true);
    $('#m2').prop('disabled', true);
    $('#m3').prop('disabled', true);
    $('#m4').prop('disabled', true);

    if (!(Number($('#m2').data('pp')) - 1 < 0)) {
      var newPP = Number($('#m2').data('pp')) - 1;
      $('#m2').data('pp', newPP);


      var moveName = $('#m2').text();
      var me = Number($('#back').data('id'));
      var you = Number($('#front').data('id'));
      var user = $('h2').text();
      var percentHealth = Number($('#enemyhealth').data("health"));
      movesMade = movesMade + 1;
      window.socket.emit('move', {
        sender: user,
        mypoke: me,
        yourpoke: you,
        hishealth: percentHealth,
        move: moveName,
        numMovesMade: movesMade,
        otherMove: toSend
      });
    } 
  });

  $('#m3').on('click', function () {
    $('#m1').prop('disabled', true);
    $('#m2').prop('disabled', true);
    $('#m3').prop('disabled', true);
    $('#m4').prop('disabled', true);

    if (!(Number($('#m3').data('pp')) - 1 < 0)) {
      var newPP = Number($('#m3').data('pp')) - 1;
      $('#m3').data('pp', newPP);


      var moveName = $('#m3').text();
      var me = Number($('#back').data('id'));
      var you = Number($('#front').data('id'));
      var user = $('h2').text();
      var percentHealth = Number($('#enemyhealth').data("health"));
      movesMade = movesMade + 1;
      window.socket.emit('move', {
        sender: user,
        mypoke: me,
        yourpoke: you,
        hishealth: percentHealth,
        move: moveName,
        numMovesMade: movesMade,
        otherMove: toSend
      });
    } 
  });

  $('#m4').on('click', function () {
    $('#m1').prop('disabled', true);
    $('#m2').prop('disabled', true);
    $('#m3').prop('disabled', true);
    $('#m4').prop('disabled', true);

    if (!(Number($('#m4').data('pp')) - 1 < 0)) {
      var newPP = Number($('#m4').data('pp')) - 1;
      $('#m4').data('pp', newPP);


      var moveName = $('#m4').text();
      var me = Number($('#back').data('id'));
      var you = Number($('#front').data('id'));
      var user = $('h2').text();
      var percentHealth = Number($('#enemyhealth').data("health"));
      movesMade = movesMade + 1;
      window.socket.emit('move', {
        sender: user,
        mypoke: me,
        yourpoke: you,
        hishealth: percentHealth,
        move: moveName,
        numMovesMade: movesMade,
        otherMove: toSend
      });
    } 
  });


  $('#switch').on('click', function () {
    $('#m1').prop('disabled', false);
    $('#m2').prop('disabled', false);
    $('#m3').prop('disabled', false);
    $('#m4').prop('disabled', false);
    $('#switch').prop('disabled', false);
  });



});
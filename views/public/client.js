// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */
var movesMade = 0;
var toSend = {};
var edeaths = 0;
var pdeaths = 0;
var hasPolled = false;
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

  var DMG = function(Level, Power, A, D, STAB, Type, random) {
      return (((2 * Level / 5 + 2) * Power * (A / D))/ 50 + 2) * modifier(STAB, Type, random);
  };
  var modifier = function (STAB, Type, random) {return STAB * Type * random;};



  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);


  window.socket.on('connect', function () {
    console.log('Connected to server!');
    var user = $('h2').text();
    window.socket.emit('login', {name: user});
    $('#linker').hide();

  });

  window.socket.on('game_over', function (data) {
    console.log('GAME OVER');
    $('#linker').show();
    $('#m1').prop('disabled', true);
    $('#m2').prop('disabled', true);
    $('#m3').prop('disabled', true);
    $('#m4').prop('disabled', true);
  });

  window.socket.on('game_over_winner', function (data) {
    console.log('GAME OVER');
    $('#linker').show();
    $('#m1').prop('disabled', true);
    $('#m2').prop('disabled', true);
    $('#m3').prop('disabled', true);
    $('#m4').prop('disabled', true);
    window.socket.emit('trade', data);
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

    $('#e').text("100%");
    $('#p').text("100%");

  });

  window.socket.on('increment', function (data) {
    movesMade = movesMade + 1;
    toSend = data;
  });

  window.socket.on('repopulate_enemy', function (data){
    var id = data.id;
    var theirFilePath = '/public/front/' + id + '.gif';
    $('#front').attr('src', theirFilePath);
    $('#front').data('id', data.id);
    $('#enemyhealth').data('health', 100);
    $('#e').text("100%");
    $('#enemyhealth').width("100%");
    $('#enemytext').text(data.name);
  });

  window.socket.on('repopulate_player', function (data){
    //setting image
    var id = data.id;
    var myFilePath = '/public/back/' + id + '.png';
    $('#back').attr('src', myFilePath);

    $('#back').data('id', data.id); // setting data attribute of field
    $('#playerhealth').data('health', 100); //setting data health attr
    $('#p').text("100%"); // setting health view
    $('#playerhealth').width("100%"); // set new pokemon to full health
    $('#playertext').text(data.name);

    //setting movesets on buttons
    var myMoveSet = data.moveset;
    $('#m1').text(myMoveSet[0]);
    $('#m2').text(myMoveSet[1]);
    $('#m3').text(myMoveSet[2]);
    $('#m4').text(myMoveSet[3]);
  });

  window.socket.on('update-health', function (data) {
    //working out damage dealt to them
    var typeBonus = Type(data.them.attackingtype, data.them.deftype);
    var dmg = DMG(data.them.level, data.them.power, data.them.atk, data.them.def, data.them.stab, typeBonus, data.random);

    var percentHealth = Number($('#enemyhealth').data('health'));

    var curHealth = data.them.hp * (percentHealth / 100);
    var newHealth = Math.floor((curHealth - dmg) / data.them.hp * 100);
    if (newHealth <= 0) {
      newHealth = 0;
    }
    

    //working out damage dealt to me
    var typeBonus1 = Type(data.me.attackingtype, data.me.deftype);
    var dmg1 = DMG(data.me.level, data.me.power, data.me.atk, data.me.def, data.me.stab, typeBonus1, data.random);
    var percentHealth1 = Number($('#playerhealth').data('health'));
    var curHealth1 = data.me.hp * percentHealth1 / 100;
    var newHealth1 = Math.floor((curHealth1 - dmg1) / data.me.hp * 100);
    if (newHealth1 <= 0) {
      newHealth1 = 0;
    }
    
    //break spd ties here
    if (data.me.spd === data.them.spd) {
      var rand = (data.random - 0.85) / 0.15;
      if (rand >= 0.5) {
        data.me.spd = data.me.spd + 1;
      } else {
        data.them.spd = data.them.spd + 1;
      }
    }
    //work out speed ties here!
    //I win speed tie
    if (data.me.spd > data.them.spd) {
      //I win speed tie
      if (newHealth === 0) {
        $('#enemyhealth').data('health', newHealth);
        var newhstr = newHealth + '%'; 
        $('#enemyhealth').width(newhstr);
        $('#e').text(newhstr);
        //i won speed and got them
        edeaths += 1;
        window.socket.emit('get_enemy_secondary', {
          name: data.them.name,
          me: data.me.name,
          e: edeaths,
          p: pdeaths
        });
      } else if (newHealth1 === 0) {
        $('#playerhealth').data('health', newHealth1);
        var newhstr1 = newHealth1 + '%'; 
        $('#playerhealth').width(newhstr1);
        $('#p').text(newhstr1);

        $('#enemyhealth').data('health', newHealth);
        var newhstr = newHealth + '%'; 
        $('#enemyhealth').width(newhstr);
        $('#e').text(newhstr);
        pdeaths += 1;
        window.socket.emit('get_player_secondary', {
          name: data.me.name,
          p: pdeaths,
          e: edeaths
        });
       
        //I won speed but they got me
      } else {
        $('#enemyhealth').data('health', newHealth);
        var newhstr = newHealth + '%'; 
        $('#enemyhealth').width(newhstr);
        $('#e').text(newhstr);

        $('#playerhealth').data('health', newHealth1);
        var newhstr1 = newHealth1 + '%'; 
        $('#playerhealth').width(newhstr1);
        $('#p').text(newhstr1);
      }
    }
    //they win speed tie
    if (data.me.spd < data.them.spd) {
      if (newHealth1 === 0) {
        $('#playerhealth').data('health', newHealth1);
        var newhstr1 = newHealth1 + '%'; 
        $('#playerhealth').width(newhstr1);
        $('#p').text(newhstr1);
        console.log(data.me.name);
        pdeaths += 1;
        window.socket.emit('get_player_secondary', {
          name: data.me.name,
          p: pdeaths,
          e: edeaths
        });
        
        // I lost speed and they got me
      } else if (newHealth === 0) { 
        $('#enemyhealth').data('health', newHealth);
        var newhstr = newHealth + '%'; 
        $('#enemyhealth').width(newhstr);
        $('#e').text(newhstr);

        $('#playerhealth').data('health', newHealth1);
        var newhstr1 = newHealth1 + '%'; 
        $('#playerhealth').width(newhstr1);
        $('#p').text(newhstr1);
        edeaths += 1;
        window.socket.emit('get_enemy_secondary', {
          name: data.them.name,
          me: data.me.name,
          e: edeaths,
          p: pdeaths
        });
        
        //i lost speed but got them
      } else {
        $('#enemyhealth').data('health', newHealth);
        var newhstr = newHealth + '%'; 
        $('#enemyhealth').width(newhstr);
        $('#e').text(newhstr);

        $('#playerhealth').data('health', newHealth1);
        var newhstr1 = newHealth1 + '%'; 
        $('#playerhealth').width(newhstr1);
        $('#p').text(newhstr1);
      }
    }


    movesMade = 0;
    toSend = {};

    $('#m1').prop('disabled', false);
    $('#m2').prop('disabled', false);
    $('#m3').prop('disabled', false);
    $('#m4').prop('disabled', false);

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
// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
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

    yourFilePath = '/public/front/' + yourFilePath + '.gif';
    myFilePath = '/public/back/' + myFilePath + '.png';

    $('#front').attr('src', yourFilePath);
    $('#back').attr('src', myFilePath);
  });




});
#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

amqp.connect('amqp://localhost').then(function(conn) {
  return when(conn.createChannel().then(function(ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    var ok = ch.assertQueue(q, {durable: false});
    
    return ok.then(function(_qok) {
      ch.sendToQueue(q, new Buffer(msg));
      // when sendToQueue returns false the buffer is full see the "drain" event
      // of the channel how to handle this
      console.log(" [x] Sent '%s'", msg);
      return ch.close();
    });
  })).ensure(function() { conn.close(); });
}).then(null, console.warn);

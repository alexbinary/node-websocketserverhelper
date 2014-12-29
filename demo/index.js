/*
 * index.js - websockeserverhelper demo
 *
 * echoes back every message
 *
 * @author Alexandre Bintz
 * dec. 2014
 *
 * usage:
 *
 * node index.js port
 *
 * if omitted, port defaults to 36521
 */

"use strict";

var rWsServer = require('./websocketserverhelper');

var defaultPort = 36521;
var port = process.argv.length > 2 && process.argv[2].match(/^[0-9]+$/) ? process.argv[2] : defaultPort;

var supportedProtocols = [];

var connectionHandler = {
  handleConnection: function handleConnection(pConnection) {
    pConnection.on('message', function(pMessageRaw) {
      console.log(pMessageRaw);
      pConnection.send(pMessageRaw.utf8Data);
    });
  }
};

var wsServer = rWsServer.createServer(
  supportedProtocols,
  connectionHandler
);

wsServer.listen(port);

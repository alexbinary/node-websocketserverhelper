/**
 * websocketserverhelper.js - generic websocket server
 *
 * @author Alexandre Bintz
 * dec. 2014
 *
 * @require package 'websocket'
 */

"use strict";

var rWebSocket = require('websocket');
var rHttp      = require('http');

/**
 * Server
 *
 * @constructor
 *
 * @param {array}       pSupportedProtocols - list of supported websocket sub-protocols
 * @param {object}      pConnectionHandler  - connection handler
 *        must have following functions:
 *        - handleConnection({WebSocketConnection})
 * @param {http.Server} pHttpServer         - supportive HTTP server (optionnal)
 */
function Server(pSupportedProtocols, pConnectionHandler, pHttpServer) {

  console.log('initializing new websocket server');

  this.supportedProtocols = pSupportedProtocols || [];
  this.connectionHandler  = pConnectionHandler;
  this.httpServer         = pHttpServer;

  this.acceptUndefinedProtocol = true;

  if(!connectionHandlerIsValid(this.connectionHandler)) {
    console.warn('WARNING: creating websocket server with invalid connection handler');
  }

  if(!this.httpServer) {
    console.log('no HTTP server set, creating one');

    this.httpServer = rHttp.createServer();
    var _this = this;
    this.httpServer.on('listening', function() {
      console.log('listening on ' + _this.httpServer.address().address + ':' + _this.httpServer.address().port);
    });
  }

  this.socketServer = new rWebSocket.server({
    'httpServer': this.httpServer,
    autoAcceptConnections: false
  });

  var _this = this; // _this references the current Server object

  this.socketServer.on('request', function(pRequest) {

    console.log('websocket request:');
    console.log({
      'host':       pRequest.host,
      'path':       pRequest.resource,
      'version':    pRequest.webSocketVersion,
      'origin':     pRequest.origin,
      'extensions': pRequest.requestedExtensions,
      'protocols':  pRequest.requestedProtocols
    });

    var selectedProtocol = selectProtocol(pRequest.requestedProtocols, _this.supportedProtocols);
    console.log('selected protocol is: ' + (selectedProtocol ? selectedProtocol : 'none'));

    if(selectedProtocol || _this.acceptUndefinedProtocol) {

      console.log('accepting connection');
      pRequest.accept(selectedProtocol, pRequest.origin);

    } else {

      console.log('rejecting connection');
      pRequest.reject();
    }
  });

  this.socketServer.on('connect', function(pConnection) {

    console.log('websocket connection');

    if(connectionHandlerIsValid(_this.connectionHandler)) {
      _this.connectionHandler.handleConnection(pConnection);
    }
  });

  this.socketServer.on('close', function(pConnection, pCode, pReason) {

    console.log('websocket closed: '+ pCode + ': ' + pReason);
  });
}

/**
 * Server - start server
 *
 * @param {number} pPort - port to listen on, a random port is selected if omitted
 */
Server.prototype.start = function(pPort) {

  this.httpServer.listen(pPort);
}

/**
 * Checks if connection handler is valid
 * Handler is considered valid if it has a callable function named `handleConnection`
 *
 * @param {object} pConnectionHandler - connection handler to test
 */
function connectionHandlerIsValid(pConnectionHandler) {

  return pConnectionHandler && typeof pConnectionHandler.handleConnection == 'function';
}

/**
 * Selects a websocket sub-protocol based on requested and supported protocols
 *
 * @param {array} pRequestedProtocols - list of requested websocket sub-protocols
 * @param {array} pSupportedProtocols - list of supported websocket sub-protocols
 *
 * @return {string|null} the selected protocol, null means no protocol is selected
 */
function selectProtocol(pRequestedProtocols, pSupportedProtocols) {

  var selectedProtocol = null;

  for(var i in pRequestedProtocols) {
    if(pSupportedProtocols.indexOf(pRequestedProtocols[i]) != -1) {
      selectedProtocol = pRequestedProtocols[i];
      break;
    }
  }
  return selectedProtocol;
}

/**
 * Create a new Server object
 *
 * @param {array}       pSupportedProtocols - list of supported websocket sub-protocols
 * @param {object}      pConnectionHandler  - connection handler
 *        must have following functions:
 *        - handleConnection({WebSocketConnection})
 * @param {http.Server} pHttpServer         - supportive HTTP server (optionnal)
 *
 * @return {Server}
 */
function createServer(pHttpServer, pSupportedProtocols, pConnectionHandler) {

  return new Server(pHttpServer, pSupportedProtocols, pConnectionHandler);
}

/* exports
 */
module.exports.createServer = createServer;

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

/**
 * Server
 *
 * @constructor
 *
 * @param {http.Server} pHttpServer         - supportive HTTP server
 * @param {array}       pSupportedProtocols - list of supported websocket sub-protocols
 * @param {object}      pConnectionHandler  - connection handler
 *        must have following functions:
 *        - handleConnection({WebSocketConnection})
 */
function Server(pHttpServer, pSupportedProtocols, pConnectionHandler) {

  /* checks if connection handler is valid
   */
  function connectionHandlerIsValid(pConnectionHandler) {
    return pConnectionHandler && typeof pConnectionHandler.handleConnection == 'function';
  }

  if(!pHttpServer) {
    console.error('ERROR: creating websocket server with invalid HTTP server');
    return;
  }

  if(!connectionHandlerIsValid(pConnectionHandler)) {
    console.warn('WARNING: creating websocket server with invalid connection handler');
  }

  var supportedProtocols = pSupportedProtocols || [];

  this.socketServer = new rWebSocket.server({
    'httpServer': pHttpServer,
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

    var selectedProtocol = selectProtocol(pRequest.requestedProtocols, supportedProtocols);
    console.log('accepting connection with protocol: ' + (selectedProtocol ? selectedProtocol : 'none'));
    pRequest.accept(selectedProtocol, pRequest.origin);
  });

  this.socketServer.on('connect', function(pConnection) {

    console.log('websocket connection');

    if(connectionHandlerIsValid(pConnectionHandler)) {
      pConnectionHandler.handleConnection(pConnection);
    }
  });

  this.socketServer.on('close', function(pConnection, pCode, pReason) {

    console.log('websocket closed: '+ pCode + ': ' + pReason);
  });
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
 * @param {http.Server} pHttpServer         - supportive HTTP server
 * @param {array}       pSupportedProtocols - list of supported websocket sub-protocols
 * @param {object}      pConnectionHandler  - connection handler
 *        must have following functions:
 *        - handleConnection({WebSocketConnection})
 *
 * @return {Server}
 */
function createServer(pHttpServer, pSupportedProtocols, pConnectionHandler) {

  return new Server(pHttpServer, pSupportedProtocols, pConnectionHandler);
}

/* exports
 */
module.exports.createServer = createServer;

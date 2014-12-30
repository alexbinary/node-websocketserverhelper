
# WebSocketServerHelper

Minimalist wrapper for `WebSocketServer` object from NPM `websocket` package.
https://www.npmjs.com/package/websocket

Features :

- easy setup ;
- transparent event logging ;
- decouple connection handling from generic server logic.

This module is good for experimenting and quick prototyping due to its easy setup and rich log output.
However it might not be suited when precise configurations, performances, or security are required.


# Minimalistic example

```javascript
var wsServer = require('websocketserverhelper').createServer(
  ['echo'],
  {
    handleConnection: function(pConnection) {
      pConnection.on('message', function(pMessageRaw) {
        pConnection.send(pMessageRaw.utf8Data);
      });
    }
  }
);
wsServer.start(36521);
```


# Module documentation

## Exported methods

### createServer([protocols], [connectionHandler], [httpServer])

Creates and returns a new `Server` object with the given connection handler.

`protocols` is the list of websocket sub-protocols supported by the server.
For every new connection the server selects the first sub-protocol requested by the client that is in this list.
If none of the protocols requested by the client is supported by the server,
or if no protocol is requested, no sub-protocol is selected.
In this case, if the `acceptUndefinedProtocol` property is set to `false` then the connection is rejected.
Otherwise the connection is accepted with no sub-protocol.  
This parameter defaults to an empty array if omitted, meaning that no protocol will ever be selected.  
The list of supported protocols can be (re)set via the `supportedProtocols` property.

`connectionHandler` must provide a function `handleConnection` which will be called
for each connection the server receives, with the `WebSocketConnection` object passed as first parameter.
The handler can be (re)set via the `connectionHandler` property.

`httpServer` is the supportive HTTP server (native Node's `http.Server` object) used by the websocket server.
If omitted or invalid a default server is created.
The server can be accessed via the `httpServer` property.


# 'Server' object Documentation

## Constructor

### Server([protocols], [connectionHandler], [httpServer])

Init a new WebSocket server.
See `createServer()` above.

## Properties

### acceptUndefinedProtocol

If `true`, the server will be allowed not to select any sub-protocol, if it thinks it should do so based on the protocols requested by the client.
If `false`, any connection that make the server not select any sub-protocol will be rejected.

Default value is `true`.

### connectionHandler

The connection handler called each time a client connect to the server.
This property is set by the constructor. See constructor documentation for more infos.
This property can be (re)set at any time.

### httpServer

The supportive HTTP server used by the websocket server (native Node's `http.Server` object).
This property is set by the constructor. See constructor documentation for more infos.
Re(setting) this property has no effect.

### socketServer

The underlying native `WebSocketServer` object.

### supportedProtocols

Array of websocket sub-protocols supported by the server.
This property is set by the constructor. See constructor documentation for more infos.
This property can be (re)set at any time.


## Methods

### start([port])

Start the server on specified port.
If port is omitted a random port is selected.


# Infos

WebSocket overview on MDN : https://developer.mozilla.org/en-US/docs/Web/API/WebSocket  
NPM `websocket` package : https://www.npmjs.com/package/websocket


# Contact

Alexandre Bintz <alexandre.bintz@gmail.com>  
Comments and suggestions are welcome.


# WebSocketServerHelper

Minimalist wrapper for `WebSocketServer` object from NPM `websocket` package.
https://www.npmjs.com/package/websocket

Features :

- easy setup ;
- transparent event logging ;
- decouple connection handling from generic server logic.

This module is good for experimenting and quick prototyping due to its easy setup and rich log output.
However it might be not suitable for precise configurations and performances/security requirements.


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
wsServer.listen(36521);
```


# Module documentation

## Exported methods

### createServer([protocols], [connectionHandler], [httpServer])

Creates and returns a new `Server` object with the given connection handler.

`protocols` is the list of websocket sub-protocols supported by the server.
Upon connection the selected sub-protocol is the first protocol requested by the client that
is supported by the server.
If none of the protocols requested by the client is supported by the server,
or if no protocol is requested, no sub-protocol is selected.
Defaults to an empty array, meaning that no protocol will ever be selected.
The value can be (re)set via the `supportedProtocols` property.

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

### supportedProtocols

Array of websocket sub-protocols supported by the server.
This property is set by the constructor. See constructor documentation for more infos.
This property can be (re)set at any time.

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


# Run the demo

You need to have Node.js installed to run the demo.

Launch the demo app with :

    cd demo/
    node index.js

You can use http://software.hixie.ch/utilities/js/websocket/ as a client application.
Enter `ws://localhost:36521` in "WebSocket URL".

The app launches on port `36521` by default.
You can specify another port by passing it as first argument. For example

    node index.js 42424

Will run the app on port `42424`. In that case use `ws://localhost:42424` in the client.


# Infos

WebSocket overview on MDN : https://developer.mozilla.org/en-US/docs/Web/API/WebSocket  
NPM `websocket` package : https://www.npmjs.com/package/websocket


# Contact

Alexandre Bintz <alexandre.bintz@gmail.com>  
Comments and suggestions are welcome.

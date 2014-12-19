
# WebSocketServerHelper

Minimalist wrapper for `WebSocketServer` object from NPM `websocket` package.
https://www.npmjs.com/package/websocket

Features :

- easy setup ;
- transparent event logging ;
- decouple connection handling from generic server logic.


# Module documentation

## Exported methods

### createServer(httpServer, [protocols], [connectionHandler])

Creates and returns a new `Server` object with the given connection handler.

`httpServer` is the supportive HTTP server (native Node's `http.Server` object) used by the websocket server.

`protocols` is the list of websocket sub-protocols supported by the server.
Upon connection the selected sub-protocol is the first protocol requested by the client that
is supported by the server.
If none of the protocols requested by the client is supported by the server,
or if no protocol is requested, no sub-protocol is selected.

`connectionHandler` must provide a function `handleConnection` which will be called
for each connection the server receives, with the `WebSocketConnection` object passed as first parameter.
If `connectionHandler` does not provide a valid `handleConnection` function a warning message
is logged in the console and nothing happens when the server receives a connection.


# 'Server' object Documentation

## Constructor

### Server(httpServer, [protocols], [connectionHandler])

Init a new WebSocket server.
See `createServer()` above.

## Properties

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
Any comment or suggestion is welcome.

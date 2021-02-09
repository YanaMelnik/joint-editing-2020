import { applyTextDiff } from '@joint-editing/diff-library';

const http = require('http');
const webSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

let textState = 'Test message from server';

const server = http.createServer();

const wsServer = new webSocket.Server({ server });

wsServer.on('connection', (ws) => {
  // eslint-disable-next-line no-param-reassign
  ws.connectionId = uuidv4();
  ws.send(JSON.stringify([
    {
      type: 'added',
      index: 0,
      value: textState,
    },
  ]));

  ws.on('message', (data: string) => {
    wsServer.clients.forEach((client) => {
      if (client.connectionId === ws.connectionId) return;

      client.send(data);
    });

    textState = applyTextDiff(textState, JSON.parse(data));
  });
});

const { PORT = 8080 } = process.env;
server.listen(PORT);

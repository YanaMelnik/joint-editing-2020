// import { applyTextDiff } from "@joint-editing/diff-library";

const http = require('http');
const webSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

let textState = 'Test message from server';

const server = http.createServer();

const wsServer = new webSocket.Server({ server });

// TODO: BUG - needs to be deleted when fix using library
function applyTextDiff(text: string, diffs): string {
  const newString = [];
  let cursor = 0;

  diffs.forEach((elem) => {
    if (elem.type === 'added') {
      newString.push(text.slice(cursor, elem.index));
      newString.push(elem.value);
      cursor = elem.index;
    }

    if (elem.type === 'removed') {
      if (cursor !== elem.index) {
        newString.push(text.slice(cursor, elem.index));
      }

      cursor = elem.index + elem.count;
    }
  });

  if (cursor < text.length) {
    newString.push(text.slice(cursor));
  }

  return newString.join('');
}

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

    // TODO: BUG - can't use shared library, server stopped
    textState = applyTextDiff(textState, JSON.parse(data));
  });
});

const { PORT = 8080 } = process.env;
server.listen(PORT);

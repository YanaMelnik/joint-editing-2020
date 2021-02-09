import { applyTextDiff, DiffChange, getTextDiff } from '@joint-editing/diff-library';
import ServerConnection from '@joint-editing/websocket-library';

const serverConnection = new ServerConnection();
let lastText: string = '';
let uiUint: Uint32Array;
declare let self: Worker;

function handleServerUpdate(data: DiffChange[]): void {
  const diffs = data;

  diffs.sort((a, b) => a.index - b.index);
  lastText = applyTextDiff(lastText, diffs);
  for (let i = 0; i < uiUint.byteLength / 4; i += 1) {
    const charCode = lastText.length > i ? lastText.charCodeAt(i) : 0;

    Atomics.store(uiUint, i, charCode);
  }

  self.postMessage({ action: 'update' });
}

function processDataFromBuffer(): void {
  const charArray = [];

  for (let i = 0; i < uiUint.byteLength / 4; i += 1) {
    const charCode = Atomics.load(uiUint, i);

    if (charCode === 0) break;

    charArray.push(charCode);
  }

  const updatedText: string = String.fromCharCode(...charArray);
  const diff: DiffChange[] = getTextDiff(lastText, updatedText);

  lastText = updatedText;
  serverConnection.sentDiff(diff);
}

function setBuffer(data: SharedArrayBuffer): void {
  uiUint = new Uint32Array(data);
}

self.onmessage = (message: MessageEvent) => {
  const { data } = message;
  switch (data.action) {
    case 'connect':
      serverConnection.subscribeOnServerEvents(data.value, handleServerUpdate);
      break;
    case 'update':
      processDataFromBuffer();
      break;
    case 'webpackOk':
      break;
    default:
      setBuffer(data);
  }
};

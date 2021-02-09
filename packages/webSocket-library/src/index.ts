import { DiffChange } from '@joint-editing/diff-library';

export default class ServerConnection {
  private ws: WebSocket;

  public subscribeOnServerEvents(
    url: string,
    callback: (arg: DiffChange[]) => void,
  ): void {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (message) => {
      callback(JSON.parse(message.data));
    };
  }

  public sentDiff(diff: DiffChange[]): void {
    const arg = JSON.stringify(diff);
    this.ws.send(arg);
  }
}

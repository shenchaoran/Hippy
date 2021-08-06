import createDebug from 'debug';
import { AppClientType, ClientEvent } from '../@types/enum';
import { Tunnel } from '../@types/tunnel';
import { sendMessage, tunnelMessageEmitter } from '../message-channel/tunnel';
import { AppClient } from './app-client';

const debug = createDebug('app-client:ws');

export class TunnelAppClient extends AppClient {
  constructor(id, option) {
    super(id, option);
    this.type = AppClientType.Tunnel;

    tunnelMessageEmitter.on('message', (msg) => {
      this.emit(ClientEvent.Message, msg);
    });

    tunnelMessageEmitter.on('message', (msg) => {
      this.emit(ClientEvent.Message, msg);
    });
  }

  send(msg: Tunnel.Req) {
    if (!this.filter(msg)) return;

    sendMessage(msg);
  }

  resume() {
    debug('tunnel app client resume');
    sendMessage({
      module: 'jsDebugger',
      content: 'chrome_socket_closed',
    } as any);
  }
}

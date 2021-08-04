/**
 * app 客户端，未来可能有多个消息通道：
 *    - tunnel层
 *    - app ws client
 *    - IWDP ws client
 *
 * 统一封装一层，防止app端频繁修改
 */
import WebSocket from 'ws/index.js';
import { EventEmitter } from 'events';
import { AppClientType } from '../@types/enum';
import { Tunnel } from '../@types/tunnel';

export type AppClientOption = {
  useAllDomain: boolean;
  useAdapter: boolean;
  acceptDomains?: string[];
  ignoreDomains?: string[];
  ws?: WebSocket;
};

/**
 * 对外接口：
 *  on:
 *      message       : app response
 *      close         : app 断连后触发，需通知 devtools 也断连
 *  resume            : devtools 断连后触发，需通知 v8/jscore 继续运行
 *  send              : send to app
 **/
export abstract class AppClient extends EventEmitter {
  id: string;
  type: AppClientType;
  msgBuffer: any[] = [];
  acceptDomains: string[] = [];
  ignoreDomains: string[] = [];
  useAdapter = true;
  useAllDomain = true;
  isClosed = false;

  constructor(id, { useAllDomain = true, useAdapter = true, acceptDomains = [], ignoreDomains = [] }: AppClientOption) {
    super();
    this.id = id;
    this.useAllDomain = useAllDomain;
    this.acceptDomains = acceptDomains;
    this.ignoreDomains = ignoreDomains;
    this.useAdapter = useAdapter;
  }

  abstract send(msg): void;
  abstract resume(): void;

  /**
   * 通过filter的才会下行，否则直接丢弃
   */
  protected filter(msg: Adapter.CDP.Req | Tunnel.Req) {
    if (this.useAllDomain) return true;
    let method, domain;
    if ('module' in msg) method = msg.module;
    else if ('method' in msg) method = msg.method;

    const group = method.match(/^(\w+)(\.\w+)?$/);
    if (group) {
      domain = group[1];
    }

    if (this.ignoreDomains.length) {
      const isIgnoreDomain = this.ignoreDomains.indexOf(domain) !== -1 || this.ignoreDomains.indexOf(method) !== -1;
      return !isIgnoreDomain;
    }
    const isAcceptDomain = this.acceptDomains.indexOf(domain) !== -1 || this.acceptDomains.indexOf(method) !== -1;
    return isAcceptDomain;
  }
}
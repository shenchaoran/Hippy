/**
 * app 客户端，未来可能有多个消息通道：
 *    - tunnel层
 *    - app ws client
 *    - IWDP ws client
 *
 * 统一封装一层，防止app端频繁修改
 */
import { EventEmitter } from 'events';
import WebSocket from 'ws/index.js';
import { AppClientType, ClientEvent } from '../@types/enum';
import {
  defaultDownwardMiddleware,
  defaultUpwardMiddleware,
  MiddleWareManager,
  UrlParsedContext,
} from '../middlewares';
import { CDP_DOMAIN_LIST, getDomain } from '../utils/cdp';
import { compose } from '../utils/middleware';

/**
 * 对外接口：
 *  on:
 *      message       : app response
 *      close         : app 断连后触发，需通知 devtools 也断连
 *  resume            : devtools 断连后触发，需通知 v8/jscore 继续运行
 *  send              : send to app
 **/
export abstract class AppClient extends EventEmitter {
  public id: string;
  public type: AppClientType;
  public middleWareManager: MiddleWareManager;
  protected urlParsedContext: UrlParsedContext;
  protected msgBuffer: any[] = [];
  protected acceptDomains: string[] = CDP_DOMAIN_LIST;
  protected ignoreDomains: string[] = [];
  protected useAdapter = true;
  protected useAllDomain = true;
  protected isClosed = false;

  constructor(
    id,
    {
      useAllDomain = true,
      useAdapter = true,
      acceptDomains,
      ignoreDomains = [],
      middleWareManager,
      urlParsedContext,
    }: AppClientOption,
  ) {
    super();
    this.id = id;
    this.useAllDomain = useAllDomain;
    this.acceptDomains = acceptDomains;
    this.ignoreDomains = ignoreDomains;
    this.useAdapter = useAdapter;
    this.middleWareManager = middleWareManager;
    this.urlParsedContext = urlParsedContext;
  }

  public send(msg: Adapter.CDP.Req): void {
    if (!this.filter(msg)) return;

    const { method } = msg;
    let middlewareList = this.middleWareManager.downwardMiddleWareListMap[method];
    if (!middlewareList) middlewareList = [];
    if (!(middlewareList instanceof Array)) middlewareList = [middlewareList];
    const fullMiddlewareList = [...middlewareList, defaultDownwardMiddleware];

    compose(fullMiddlewareList)(this.makeContext(msg));
  }

  protected sendToDevtools(msg: Adapter.CDP.Res) {
    if (!msg) return;
    this.emit(ClientEvent.Message, msg);
  }

  protected onMessage(msg: Adapter.CDP.Res) {
    const { method } = msg;
    let middlewareList = this.middleWareManager.upwardMiddleWareListMap[method] || [];
    if (!middlewareList) middlewareList = [];
    if (!(middlewareList instanceof Array)) middlewareList = [middlewareList];
    const fullMiddlewareList = [...middlewareList, defaultUpwardMiddleware];
    compose(fullMiddlewareList)(this.makeContext(msg));
  }

  protected makeContext(msg: Adapter.CDP.Req | Adapter.CDP.Res) {
    return {
      ...this.urlParsedContext,
      msg,
      sendToApp: this.sendToApp.bind(this),
      sendToDevtools: this.sendToDevtools.bind(this),
    };
  }

  /**
   * 通过filter的才会下行，否则直接丢弃
   */
  protected filter(msg: Adapter.CDP.Req) {
    if (this.useAllDomain) return true;
    const { method } = msg;
    const domain = getDomain(method);

    if (this.ignoreDomains.length) {
      const isIgnoreDomain = this.ignoreDomains.indexOf(domain) !== -1 || this.ignoreDomains.indexOf(method) !== -1;
      return !isIgnoreDomain;
    }
    const isAcceptDomain = this.acceptDomains.indexOf(domain) !== -1 || this.acceptDomains.indexOf(method) !== -1;
    return isAcceptDomain;
  }

  public abstract resumeApp(): void;
  protected abstract sendToApp(msg: Adapter.CDP.Req): Promise<Adapter.CDP.Res>;
  protected abstract registerMessageListener(): void;
}

export type AppClientOption = {
  useAllDomain: boolean;
  useAdapter: boolean;
  acceptDomains?: string[];
  ignoreDomains?: string[];
  ws?: WebSocket;
  middleWareManager: MiddleWareManager;
  urlParsedContext: UrlParsedContext;
};

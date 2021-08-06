declare namespace Adapter {
  type DomainCallback = (error: Adapter.CDP.ErrorRes.error, msg: Adapter.CDP.Res) => void;
  declare namespace CDP {
    interface Req {
      id: number;
      method: string;
      params?: any;
    }

    interface EventRes {
      method: string;
      params: any;
    }

    interface CommandRes {
      id: number;
      method?: string;
      result: any;
    }

    interface ErrorRes {
      id: number;
      method?: string;
      error: {
        code: number;
        message: string;
      };
    }

    type Res = EventRes | CommandRes | ErrorRes;
  }
  declare namespace IWDP {}
  declare namespace Client {

  }

  type Channel = {
    sendMessage: (msg: Adapter.CDP.Req) => void,
    registerDomainCallback: (domain: string, cb: Adapter.DomainCallback) => void,
    registerModuleCallback: (module: string, cb: Adapter.DomainCallback) => void,
  }
}

class _EventBus {
  bus: any;

  constructor() {
    this.bus = {};
  }

  $off(id: string) {
    delete this.bus[id];
  }

  $on(id: string, callback: Function) {
    this.bus[id] = callback;
  }

  $emit(id: string, ...params: any) {
    if (this.bus[id]) return this.bus[id](...params);
  }
}

export const eventBus = new _EventBus();

export const EVENT_KEY = {
  FLOW_SIGN_START: 'FLOW_SIGN_START',
  FLOW_SIGN_SUCCESS: 'FLOW_SIGN_SUCCESS',
  FLOW_SIGN_FAIL: 'FLOW_SIGN_FAIL',
};

export const flowSign = async (msg: string, right?: boolean) => {
  eventBus.$emit(EVENT_KEY.FLOW_SIGN_START, { msg, right });
  return new Promise((resolve, reject) => {
    eventBus.$on(EVENT_KEY.FLOW_SIGN_SUCCESS, (e: any) => {
      resolve(e.data);
    });
    eventBus.$on(EVENT_KEY.FLOW_SIGN_FAIL, (e: any) => {
      reject(e.data);
    });
  });
};

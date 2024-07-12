const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
class WSClient {
  constructor(options) {
    this.host = options.host;
    this.openConnection()
    this.connectionStatus = false;
    this.counter = 1;

    this.getAuthToken = () => { return null; }
    this.setAuthToken = () => { return null; }
    this.setIsAuthenticated = (status) => {};
  }

  openConnection () {
    this.ws = new WebSocket(`wss://${this.host}/socketcluster`);
    this.ws.on = (event, cb) => {
      if (this.onCallbacks[event]?.length) {
        this.onCallbacks[event].push(cb);
      } else {
        this.onCallbacks[event] = [cb];
      }
    };
    this.ws.emit = (event, requestData, cb) => {
      this.cids[this.counter] = { event, cb, requestData };
      this.ws.send(JSON.stringify({
        event: event,
        data: requestData,
        cid: this.counter
      }));
    };
    this.ws.destroyChannel = (channel) => {
      this.ws.send(JSON.stringify({event: "#unsubscribe", data: channel}));
    };
    this.ws.onmessage = (message => {
      if (message.data == "#1") {
        return this.ws.send('#2');
      }
      message = JSON.parse(message.data);
      if (message.rid && this.cids[message.rid]) {
        if(this.cids[message.rid].event == '#handshake'){
          return this.cids[message.rid].cb(message);
        }
        this.cids[message.rid].cb(null, message.data);
        delete this.cids[message.rid];
      }
      switch (message.event) {
        case '#publish' :
          message = message.data;
          if (this.ChannelsCallbacks[message.channel]) {
            this.ChannelsCallbacks[message.channel].callbacks.forEach(sub => {
              sub.cb(message.data);
            });
          }
        case '#setAuthToken' :
          this.setIsAuthenticated(true)
          return this.setAuthToken(message.data.token);
      }
    });
    this.ws.onopen = () => {
      console.log("WebSocket Client Connected.");
      this.connectionStatus = true;
      // connectCB && connectCB();
      if (this.onCallbacks.connect?.length) {
        setTimeout(() => {
          this.onCallbacks.connect.forEach(cb => {
            cb({}, () => {});
          });
        }, 0);
      }
      this.ws.emit('#handshake', { authToken: this.getAuthToken() },
        (data) => {
          this.setIsAuthenticated(data.data.isAuthenticated);
        }
      );
    };
    this.ws.onclose = () => {
      this.connectionStatus = false;
      console.log("WebSocket Client Closed.");
    };

    this.cids = {};
    this.ChannelsCallbacks = [];
    this.onCallbacks = {};
  }

  closeConnection () {
    if (this.connectionStatus) {
      this.ws.close();
      this.cids = {};
      this.ChannelsCallbacks = [];
      this.onCallbacks = {};
    } else {
      console.warn('WebSocket Client connection already closed')
    }
  }

  call = (event, request, cb) => {
      this.counter++;
      return new Promise((res, rej) => {
        if (request?.do_subscribe) {
          const cbId = guid();
          if (!this.ChannelsCallbacks[event]) {
            this.ws.send(JSON.stringify({
              event: '#subscribe',
              data: {
                channel: event,
                data: {
                  ...(request || {}),
                  request:
                    {
                      request_id: guid()
                    }
                }
              }
            }));
            this.ChannelsCallbacks[event] = {
              subscriptionId: guid(),
              callbacks: [{cbId, cb }]
            };
          } else {
            this.ChannelsCallbacks[event].callbacks.push({ cbId, cb });
          }
          res(cbId);
        } else {
          const requestData = {
            request: {
              request_id: guid()
            }
          };
          Object.assign(requestData, request);

          this.ws.emit(event, requestData, (err, data) => {
            if (cb) {
              if (err) {
                cb({
                  response: {
                    is_success: false,
                    err: err.message,
                    message: err.message,
                    request_id: requestData.request.request_id
                  }
                });
              } else {
                cb(data);
              }
            }
          });
          res();
        }
      });
  };
}

class RestClient {
  constructor(options) {
    this.host = options.host;

    this.getAuthToken = options.getAuthToken || (() => { return null; })
    this.setAuthToken = options.setAuthToken || (() => { return null; })
  }

  call (event, request, cb) {
    return fetch(`https://${this.host}/v1/${event}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(request),
    })
      .then(resp => cb(resp.json()))
      .catch(err => cb(err))
  }
}
// export default 
class ApiSDK {
  constructor(options) {
    this.options = options;
    this.wsClient = null;
    this.restClient = null;

    this.v1 = this.sdkGetter;
  }

  initWsClient(options) {
    const combinedOptions = {...this.options, ...options}
    if (!combinedOptions?.host) {
      throw new Error('ApiSdk host is missing')
    }
    if (!this.wsClient) {
      this.wsClient = new WSClient(combinedOptions);
    }
  }

  initRestClient(options) {
    const combinedOptions = {...this.options, ...options}
    if (!combinedOptions?.host) {
      throw new Error('ApiSdk host is missing')
    }
    if (!this.restClient) {
      this.restClient = new RestClient(combinedOptions);
    }
}

  sdkGetter = new Proxy(this, {
    get(obj, nameSpace) {
      return new Proxy(obj, {
        get(obj, event) {
          return function (request, cb) {
            if (nameSpace == 'ws') {
              if (!obj.wsClient) {
                obj.initWsClient(obj.options);
              }
              return obj.wsClient.call(event, request, cb)
                .then()
                .catch((reason) => console.error(reason));
            }
            if (!obj.restClient) {
              obj.initRestClient(obj.options);
            }
            return obj.restClient.call(`${nameSpace}/${event}`, request, cb)
              .then()
              .catch((reason) => console.error(reason));
          };
        }
      });
    }
  });
}

const apiSdk = new ApiSDK({
  host: tpEndpoint.url,
  getAuthToken: () => {
    return localStorage.getItem('authToken')
  },
  setAuthToken: (token) => {
    return localStorage.setItem('authToken', token)
  },
  setIsAuthenticated: (status) => {
    return localStorage.setItem('isauth', status)
  }
});

apiSdk.initWsClient();
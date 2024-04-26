import StompJs from 'stompjs';
import SockJS from 'sockjs-client';

class StompApi {
  constructor() {
    this.stompClient = null;
    this.subscriptions = {};
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = StompJs.over(socket);
    this.stompClient.connect({}, this.onConnectedCallback, this.onErrorCallback);
  }

  onConnectedCallback = () => {};

  onErrorCallback = (err) => {      
    console.log("Error: ", err);
  };

  subscribe(destination, onMessageReceived) {
    // if (!this.stompClient) {
    //   throw new Error('WebSocket is not connected');
    // }
    const subscription = this.stompClient.subscribe(destination, onMessageReceived);
    this.subscriptions[destination] = subscription;
    return subscription;
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions[destination];
    if (subscription) {
      subscription.unsubscribe();
      delete this.subscriptions[destination];
    }
  }

  send(destination, body, headers = {}) {
    if (!this.stompClient || !this.stompClient.connected) {
      throw new Error(`WebSocket is not connected, the StompClient = ${JSON.stringify(this.stompClient)}`);
    }
    console.log("BEFORE SEND");
    this.stompClient.send(destination, body, headers);
    console.log("AFTER  SEND");
  }

  disconnect() {
    if (this.stompClient) {
      Object.values(this.subscriptions).forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.stompClient.disconnect();
    }
  }
}

export default StompApi;
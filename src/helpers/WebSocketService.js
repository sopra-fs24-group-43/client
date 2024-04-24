import StompJs from 'stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = {};
  }

  connect(endpoint, onConnectedCallback, onErrorCallback) {
    const socket = new SockJS(endpoint);
    this.stompClient = StompJs.over(socket);
    console.log("STOMP CLIENT = ", this.stompClient);
    this.stompClient.connect({}, onConnectedCallback, onErrorCallback);
    console.log("AFTER CONNECTION");
  }

  subscribe(destination, onMessageReceived) {
    if (!this.stompClient) {
      throw new Error('WebSocket is not connected');
    }
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

  send(destination, headers = {}, body) {
    // if (!this.stompClient || !this.stompClient.connected) {
    //   throw new Error('WebSocket is not connected');
    // }
    console.log("BEFORE SEND");
    this.stompClient.send(destination, headers, body);
    console.log("AFTER  SEND");
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      Object.values(this.subscriptions).forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.stompClient.disconnect();
    }
  }
}

export default WebSocketService;
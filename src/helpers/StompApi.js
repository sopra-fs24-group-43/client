import StompJs from 'stompjs';
import SockJS from 'sockjs-client';

class StompApi {
    constructor() {
        this.stompClient = null;
        this.subscriptions = {};
        this._connected = false;
    }

    connect(onConnectedCallback = this.defaultOnConnectedCallback) {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = StompJs.over(socket);
        this.stompClient.connect({}, onConnectedCallback, this.onErrorCallback); //changed!!!
        this._connected = true
    }
    isConnected() {
        return this._connected;
    }
    defaultOnConnectedCallback = () => {};

    onErrorCallback = (err) => {
        console.log("Error: ", err);
    };

    subscribe(destination, onMessageReceived) {
        if (!this.stompClient) {
            throw new Error('WebSocket is not connected');
        }
        const subscription = this.stompClient.subscribe(destination, (payload) => onMessageReceived(payload));
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

    send(destination, body ) {
        if (!this.stompClient || !this.stompClient.connected) {
            throw new Error(`WebSocket is not connected, the StompClient = ${JSON.stringify(this.stompClient)}`);
        }
        if (body === ""){this.stompClient.send(destination);}
        else{this.stompClient.send(destination, {}, body);}

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
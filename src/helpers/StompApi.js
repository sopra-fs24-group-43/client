import StompJs from 'stompjs';
import SockJS from 'sockjs-client';
import {getDomain} from "./getDomain";
class StompApi {
    constructor() {
        this.stompClient = null;
        this.subscriptions = {};
        this.connected = false;
    }
    connect(onConnectedCallback = this.defaultOnConnectedCallback) {
        const socket = new SockJS(getDomain() + '/ws'); //getDomain + '/ws'
        this.stompClient = StompJs.over(socket);
        this.stompClient.connect({}, onConnectedCallback, this.onErrorCallback); //changed!!!
    }
    isConnected() {
        return this.connected;
    }

    defaultOnConnectedCallback = () => {};

    onErrorCallback = (err) => {
        console.log("Error: ", err);
    };

    subscribe(destination, onMessageReceived, filename = "") {
        if (!this.stompClient) {
            throw new Error('WebSocket is not connected');
        }
        const subscription = this.stompClient.subscribe(destination, (payload) => onMessageReceived(payload));
        this.subscriptions[destination + filename] = subscription;
        return subscription;
    }
    issubscribedto(destination, filename= ""){
        const subscription = this.subscriptions[destination + filename]
        //console.log(destination+filename)
        //console.log("subscription:" + typeof subscription)
        //console.log("subscription:" + subscription)
        if (subscription === undefined){
            return false
        }
        else {
            return true
        }
    }
    unsubscribe(destination, filename = "") {
        const subscription = this.subscriptions[destination + filename];
        if (subscription) {
            subscription.unsubscribe();
            delete this.subscriptions[destination + filename];
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
            console.log(JSON.stringify(this.subscriptions))
            Object.values(this.subscriptions).forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.stompClient.disconnect();
            this.connected = false;
        }
    }
}

export default StompApi;
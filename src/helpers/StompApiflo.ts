import StompJs from "stompjs";

import SockJS from "sockjs-client";




export class StompApiflo {



    public sock: any;
    public stomp: any;
    constructor() {
    }
    public connect = () => {
        this.sock = new SockJS('http://localhost:8080/ws');
        this.stomp = StompJs.over(this.sock);
        this.stomp.connect({},this.onConnected, this.onError);

    }
    public subscribeafterconnect = (destination,handleResponse) => {
        const Subscription = this.stomp.subscribe(destination, (payload) => handleResponse(payload));
        return Subscription;
    }
    public onConnected = () => {

        //this.stomp.subscribe('/topic/landing', (payload) => this.onMessageReceived(payload));

    }


    public onError = (err) => {     //errorcallback
        console.log(err);
    }


    public send = (endpoint, Message) => {
        if (this.stomp) {
            this.stomp.send(endpoint, {}, Message);
        }


    }
}
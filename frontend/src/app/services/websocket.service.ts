import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  public rutasActualizadas = new Subject<any>();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-rutas'),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      }
    });

    this.client.onConnect = () => {
      console.log('Conectado al WebSocket');
      this.client.subscribe('/topic/rutas', (message) => {
        if (message.body) {
          this.rutasActualizadas.next(JSON.parse(message.body));
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
  }

  public connect() {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  public disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }
}

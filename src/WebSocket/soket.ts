import { IQueryMessage } from "../components/Conversation/Models/IMessage";

interface IWsSend {
  meta: string;
  action?: string;
  room?: string;
  message: IQueryMessage;
  userRooms?: string[] | [];
  userId?: string;
  path?: string;
  dmId?: string;
  removedUserId?: string;
  invitedId?: string;
}

class Ws extends Object {
  stompClientPromise: any;
  onclose: ((response: any) => void) | undefined;
  get newClientPromise() {
    return new Promise((resolve, reject) => {
      let wsClient = new WebSocket("ws://localhost:8080");
      wsClient.onopen = () => {
        resolve(wsClient);
      };
      wsClient.onerror = (error) => {
        reject(error);
      };
    });
  }
  get clientPromise() {
    let stompClientPromise = this.stompClientPromise;
    if (!stompClientPromise) stompClientPromise = this.newClientPromise;
    this.stompClientPromise = stompClientPromise;
    return stompClientPromise;
  }
}

export function wsSend(data: IWsSend) {
  wsSingleton.clientPromise
    .then((wsClient: any) => {
      wsClient.send(JSON.stringify(data));
    })
    .catch((error: string) => console.log(error));
}

export const wsSingleton = new Ws();

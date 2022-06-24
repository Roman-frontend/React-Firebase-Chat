export interface IQueryMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  replyOn: string;
  replySenderId?: string;
  chatType: string;
  chatId: string;
}

export interface IMapedMessage extends IQueryMessage {
  hasHeader?: boolean;
}

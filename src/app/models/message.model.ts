export interface MsgDate {
  d: number;
  mo: number;
  h: number;
  mi: number;
}

export interface Messages {
  username: string;
  message: string;
  time: MsgDate;
}

export interface Chats {
  chatId: string;
  chatName: string;
  messages: Messages[];
}

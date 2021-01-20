import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { MsgDate } from '../models/message.model';

const SOCKET_ENDPOINT_DEV = 'https://polar-bastion-67911.herokuapp.com';



@Injectable({providedIn: 'root'})
export class SocketService {
  socket: any;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT_DEV);
    // this.subject = new Subject<{msg: string, uname: string, date: MsgDate}>();
  }
  // auto connection to users phool after loging to site
  ConnectToPhool(userid: string , username: string, room: string) {
    this.socket.emit('NewConnectionToPhool', ({username, room, userid}));
  }
  // ConnectToChat join user to chat
  ConnectToPrivateChat(id: string, chatId: string, chatname: string) {
    this.socket.emit('ConnectToChat', ({id, chatId, chatname}));
  }

  CreateGroupChat(roomName: string, fromId: string) {
    this.socket.emit('NewGroupChat', ({fromId, roomName}));
  }

  CreateNewPrivateChat(fromName: string, fromId: string, toName: string, toId: string) {
    this.socket.emit('NewPrivateChat', ({fromId, fromName, toId, toName}));
  }

  AddUserToGroupChat(fromId: string, toId: string, roomName: string, roomId: string) {
    console.log('fromid, toid, chatname, chatid -> ', fromId, toId, roomName, roomId);
    this.socket.emit('NewUserToGroupChat', ({fromId, toId, roomName, roomId}));
  }

  // JoinChatRoom enters user to room to start conversation
  UserJoinChat(uname: string, roomname: string, roomid: string, uid: string) {
    console.log('UserJoinChat -> ', uname, roomname, roomid, uid);
    this.socket.emit('JoinChatRoomNotification', ({uname, uid, roomid, roomname}));
  }

  SendMessage(msg: string, username: string, userid: string, time: MsgDate, chatid: string) {
    this.socket.emit('NewChatMessage', ({ msg, username, userid, time, chatid}));
  }

  GetConnectedUsers() {
    const observable = new Observable(observer => {
      this.socket.on('NewUser', (newuser) => {
        observer.next(newuser);
      });
    });
    return observable;
  }

  GetNewChat() {
    const observable = new Observable(observer => {
      this.socket.on('NewChat', (newchat) => {
        observer.next(newchat);
      });
    });
    return observable;
  }

  GetNewChatGroup() {
    const observable = new Observable(observer => {
      this.socket.on('CreateNewGroupChat', (newChat) => {
        // console.log('GetNewChatGroup -> ', newChat.chatname);
        observer.next(newChat.chatname);
      });
    });
    return observable;
  }

  GetNewChatMessage() {
    const observable = new Observable(observer => {
      this.socket.on('NewChatMessage', (newmessage) => {
        console.log('NewChatMessageNewChatMessage>>>>>>');
        observer.next(newmessage);
      });
    });
    return observable;
  }

  sendMessage(msg: string, time: MsgDate, username: string, userid: string, chatid: string) {
    this.socket.emit('NewChatMessage', ({msg, time, username, userid, chatid}));
  }

  LogoutUser(userid: string, chats: any[]) {
    if (chats.length > 0 ) {
      this.socket.emit('DisconnectUserFromChats', ({userid, chats}));
    }
    this.socket.emit('DisconnectUserFromPhool', ({userid}));
  }

}

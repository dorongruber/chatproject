import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chats, Messages, MsgDate } from '../models/message.model';

@Injectable({providedIn: 'root'})
export class ChatsService {

  allUsers: Subject<[{name: string, uid: string}]>;

  allmessages: Subject<{message: string, username: string, userid: string,
     time: MsgDate, chatname: string, chatid: string}>;
  allchats: Chats[] = [];
  divideMessagesToChats: Messages[] = [];
  currentChatMessages = new Subject<Messages>();
  newchat: Subject<{ sourceId: string, destinationId: string,
     roomname: string, roomId: string}>;

  currentchatId: string;
  constructor(
    private socketservice: SocketService
  ) {

    this.allUsers = this.socketservice
    .GetConnectedUsers()
    .pipe(map((response) => {
      // console.log('response GetConnectedUsers -> ', response);
      return response;
    })) as Subject<[{name: string, uid: string}]>;

    this.newchat = this.socketservice
    .GetNewChat()
    .pipe(map((response: any) => {
      console.log('response GetNewChat -> ', response.response.roomId);
      const index = this.allchats.findIndex(c => c.chatId === response.response.roomId);

      if ( index === -1) {
        console.log('response index -> ', index);
        this.EnterNewChatToList(response.response);
      }
      return response;
    })) as Subject<{ sourceId: string
    , destinationId: string, roomname: string, roomId: string}>;

    this.allmessages = this.socketservice
    .GetNewChatMessage()
    .pipe(map((response: any) => {

      return response;

    })) as Subject<{message: string, username: string, userid: string,
       time: MsgDate, chatname: string, chatid: string}>;


    this.allmessages.subscribe((data: {message: string, username: string, userid: string,
      time: MsgDate, chatname: string, chatid: string}) => {
        console.log('mewmessage -> ', data, this.allchats);

        const index = this.allchats.findIndex(c => c.chatId === data.chatid);
        console.log('GetNewChatMessage index -> ', index);
        if (index > -1) {
          this.allchats[index].messages.push({
            username: data.username,
            message: data.message,
            time: data.time
          });
          console.log('data all messeages -> ', data.chatid);
          console.log('current chatname -> ', this.currentchatId);
          if (data.chatid === this.currentchatId) {
            const mindex = this.allchats[index].messages.length - 1;
            console.log('terue -> ', mindex);
            console.log('allchats[index[ -> ', this.allchats[index]);
            this.currentChatMessages.next(this.allchats[index].messages[mindex]);
          }
        }
        // this.divideMessagesToChats.push({
        //   username: data.username,
        //   message: data.message,
        //   time: data.time
        // });

    });
  }

  EnterNewChatToList(data: { sourceId: string, destinationId: string,
     roomname: string, roomId: string}) {

    this.allchats.push({
      chatId: data.roomId,
      chatName: data.roomname,
      messages: []
    });
  }

  SetCurrentChat(chatid: string) {
    this.currentchatId = chatid;
  }

  ConnectToSocket(username: string, uid: string, roomname: string) {
    this.socketservice.ConnectToPhool(uid, username, roomname);
  }

  GetChatPastMessages(chatid: string) {
    const index = this.allchats.findIndex(c => c.chatId === chatid);
    if ( index > -1) {
      return this.allchats[index].messages;
    }

  }

}

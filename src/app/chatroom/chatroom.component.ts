import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { ChatsService } from '../services/chats.service';
import { UserService } from '../services/user.service';
import { Messages, MsgDate } from '../models/message.model';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, OnChanges {
  @Input()connectedUserList: {name: string, uid: string}[] = [];
  @Input()roomInfo: {userid: string, roomname: string, roomid: string};

  @Output()chatstate = new EventEmitter<boolean>();

  currentUser: {name: string, phone: string, email: string, id: string};
  chatMessages: Messages[] = [];
  message = new FormControl('');
  chatname: string;
  constructor(
    private socketservice: SocketService,
    private chatsservice: ChatsService,
    private userservice: UserService
  ) { }

  ngOnInit() {
    if (this.roomInfo !== undefined) {
      this.chatMessages = this.chatsservice.GetChatPastMessages(this.roomInfo.roomid);
      this.chatsservice.currentChatMessages.subscribe(res => {
      this.chatMessages.push({
        username: res.username,
        message: res.message,
        time: res.time
      });
    });
    }
  }

  async ngOnChanges() {
    this.chatMessages = [];
    if (this.roomInfo !== undefined) {

      this.chatMessages = this.chatsservice.GetChatPastMessages(this.roomInfo.roomid);
    //   this.chatsservice.currentChatMessages.subscribe(res => {
    //   this.chatMessages.push({
    //     username: res.username,
    //     message: res.message,
    //     time: res.time
    //   });
    // });

      await this.GetUserFromDb().then(res => {
        this.currentUser = {
        name: res.username,
        phone: res.phone,
        email: res.email,
        id: this.roomInfo.userid
      };
    });
      this.socketservice.UserJoinChat(this.currentUser.name, this.roomInfo.roomname,
       this.roomInfo.roomid, this.roomInfo.userid);


      this.chatname = this.roomInfo.roomname;
      this.chatsservice.SetCurrentChat(this.roomInfo.roomid);





      console.log('joinusertochat -> ', this.roomInfo);

    }
  }

  SendMessage(message: FormControl) {
    const td = new Date();
    const date = {
      d: td.getDate(),
      mo: td.getMonth() + 1,
      h: td.getHours(),
      mi: td.getMinutes()
    };

    this.socketservice.sendMessage(message.value, date, this.currentUser.name, this.currentUser.id, this.roomInfo.roomid);
    message.reset();
  }

  async GetUserFromDb() {
    let tempuser: {username: string, phone: string, email: string};
    return (await this.userservice.GetUser(this.roomInfo.userid)).toPromise().then(res => {
      const temp = Object.values(res);
      tempuser = {
        username: temp[0],
        phone: temp[1],
        email: temp[2]
      };
      return tempuser;
    });
  }

  AddUserToGroupChat(toname: string, toid: string) {
    this.socketservice.AddUserToGroupChat(this.currentUser.id, toid, this.roomInfo.roomname, this.roomInfo.roomid);
    // document.getElementById('ul-sidenav').style.display = 'none';
  }

  ShowConnectedUsers() {
    document.getElementById('ul-sidenav').style.display = 'block';
  }

  CloseUserList() {
    document.getElementById('ul-sidenav').style.display = 'none';

  }

  ExitChat() {
    this.chatstate.emit(false);

  }

}

import {Component , OnInit, OnDestroy, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { ChatsService } from '../services/chats.service';
import { Messages, MsgDate } from '../models/message.model';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
// import { Chat } from '../models/chat.model';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewChatFormComponent } from '../bottomsheet/newchatform/newchatform.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentUser: {name: string, phone: string, email: string, id: string};
  userId$: Observable<string>;
  uId: string;
  chats = [];
  connectedUsers: {name: string, uid: string}[] = [];
  openchat: {userid: string, roomname: string, roomid: string};
  opened = false;

  constructor(
    private chatsservice: ChatsService,
    private socketservice: SocketService,
    private userservice: UserService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.userId$ = this.route.paramMap.pipe(
      switchMap(params => {
        return params.getAll('id');
      })
    );
    this.userId$.subscribe(res => {
      this.uId = res;
    });
    await this.GetUserFromDb().then(res => {
      this.currentUser = {
        name: res.username,
        phone: res.phone,
        email: res.email,
        id: this.uId
      };
    });
    console.log('current user -> ', this.currentUser);
    this.chatsservice.ConnectToSocket(this.currentUser.name, this.currentUser.id, 'AddtoPool');

    // get all connected users
    this.chatsservice.allUsers.subscribe((data: any) => {
      // for every new user all connected user plus new user send ...?
      console.log('userslist component all users -> ', data);
      const temp = data.reslistFormat.filter(u => u.name !== this.currentUser.name);

      temp.forEach(u => {
        const index = this.connectedUsers.findIndex(user => user.uid === u.uid);
        if ( index === -1) {
          this.connectedUsers.push({
            name: u.name,
            uid: u.uid
          });
        }
      });
      console.log('userlist -> ', this.connectedUsers);
    });

    this.chatsservice.newchat.subscribe((data: any) => {

        if (data.response.sourceId === this.currentUser.id  ||
          data.response.destinationId === this.currentUser.id ) {
          console.log('same origin or!!!!!!!!!!!!!');
          this.socketservice.ConnectToPrivateChat(this.currentUser.id,
             data.response.roomId, data.response.roomname);
          this.chats.push({
              sourceId: data.response.sourceId,
              destinationId: data.response.destinationId,
              roomname: data.response.roomname,
              roomId: data.response.roomId
            });
        } else {
          console.log('probleam with same origin================!!!!!');
        }

      });

    window.addEventListener('unload ', (event) => {


      // event.returnValue = true;
      // event.preventDefault();
      setTimeout(() => {window.alert('unload'); }, 1000);
      this.LogOut();
      });

    // end obinit
  }


  async GetUserFromDb() {
    let tempuser: {username: string, phone: string, email: string};
    return (await this.userservice.GetUser(this.uId)).toPromise().then(res => {
      const temp = Object.values(res);
      tempuser = {
        username: temp[0],
        phone: temp[1],
        email: temp[2]
      };
      return tempuser;
    });
  }

  NewChat() {
    this.bottomSheet.open(NewChatFormComponent,
      {data: {uId: this.currentUser.id, username: this.currentUser.name}
    });
  }

  ShowList() {

    document.getElementById('cr-page').style.display = 'none';
    document.getElementById('ul-page').style.display = 'block';
    this.opened = !this.opened;
  }

  OpenChat(chattoopen: {sourceId: string, destinationId: string, roomname: string, roomId: string }) {
    this.openchat = {
      userid: this.currentUser.id,
      roomname: chattoopen.roomname,
      roomid: chattoopen.roomId
    };
    this.openSidenavOption('chat_room');
  }

  openSidenavOption(option: string) {
    if (option === 'chat_room') {
      document.getElementById('ul-page').style.display = 'none';
      // document.getElementById('cr-component').style.display = 'none';
      document.getElementById('cr-page').style.display = 'grid';
      document.getElementById('cr-page').style.background = 'linear-gradient(45deg, wheat, #00737a)';

    } else {
      document.getElementById('ul-page').style.display = 'block';
      // document.getElementById('cr-component').style.display = 'grid';
      document.getElementById('cr-page').style.display = 'none';

    }
    this.opened = !this.opened;
  }

  CloseChat(chatstate: boolean) {
    this.opened = chatstate;
    document.getElementById('ul-page').style.display = 'none';
    document.getElementById('cr-page').style.display = 'none';
    // document.getElementById('cr-component').style.display = 'none';
  }

  LogOut() {

    setTimeout(() => {
      this.socketservice.LogoutUser(this.currentUser.id, this.chats);
      window.alert('logout');

      this.router.navigate(['/login']);
    }, 1000);
    // ToDo -> disconnect user from all rooms;

  }


}

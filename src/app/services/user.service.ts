import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbUserFormat } from '../models/userDB.model';
import { environment } from 'src/environments/environment';

const IPV4_URL = 'api/user/';


@Injectable({providedIn: 'root'})
export class UserService {
  chat: Subject<{chatname: string}>;
  constructor(
    private http: HttpClient,
    private socketservice: SocketService
  ) {
    this.chat = this.socketservice
    .GetNewChatGroup()
    .pipe(map((response) => {
      console.log('response user service -> ', response);
      return response;
    })) as Subject<{chatname: string}>;
  }

  async GetUser(userId: string) {
    // console.log('before setupSocketConnection');
    return this.http.get(`${IPV4_URL}currentUser/${userId}`);

  }

  RegisterUser(user: DbUserFormat) {
    this.http.post(`${IPV4_URL}register`, user)
    .subscribe(res => {
      console.log('RegisterUser res-> ', res);
    });
  }

  LoginUser(loguser: any) {
    console.log('user UserService -> ', IPV4_URL);
    return this.http.post<{userid: string}>(`${IPV4_URL}loguser`, loguser);
  }

  // CreateGroupChat(chatname: string, userid: string, username: string) {
  //   this.socketservice.CreateNewChatGroup(chatname, userid, username);
  // }

  AddUserToChat(chatname: string, userToadd: string) {

  }
  // AddCharToUserList(chatname: string) {
  //   this.chats.push({
  //     name: chatname
  //   });
  // }

  // GetChatList() {
  //   return this.chats;
  // }
}

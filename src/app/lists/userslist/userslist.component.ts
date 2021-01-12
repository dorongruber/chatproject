import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChatsService } from '../../services/chats.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css']
})

export class UserslistComponent implements OnChanges {
  displaytate = 'hide';
  userId$: Observable<string>;
  @Input()uId: string;
  @Input()userlist: {name: string, uid: string}[] = [];
  @Output()liststate = new EventEmitter<boolean>();
  @Input()CurrentUser: {name: string, phone: string, email: string, id: string};
  constructor(
    private route: ActivatedRoute,
    private socketservice: SocketService
  ) {}

  ngOnChanges() {

    console.log('UserlistComponent!!!!!!!!!! -> ', this.userlist);

  }

  OpenChat(tousername: string, touserid: string) {
    console.log('user to connect to -> ', tousername, touserid);
    this.socketservice.CreateNewPrivateChat(this.CurrentUser.name, this.CurrentUser.id, tousername, touserid);
  }

  CloseUserListTab() {

    this.liststate.emit(false);
  }
}

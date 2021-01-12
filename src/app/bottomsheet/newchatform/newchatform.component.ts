import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { ChatsService } from '../../services/chats.service';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-driverbottomsheet',
  templateUrl: './newchatform.component.html',
  styleUrls: ['./newchatform.component.css']
})

export class NewChatFormComponent implements OnInit {
  chat = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  constructor(
    private bottomSheetRef:
    MatBottomSheetRef<NewChatFormComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private chatservice: ChatsService,
    private socketservice: SocketService
  ) {}

  ngOnInit() {

  }

  CreateGroupChat(newChat: FormGroup, event: MouseEvent) {
    if (newChat.valid) {
      // console.log('new chat -> ', newChat.value.name);
      this.socketservice.CreateGroupChat(newChat.value.name, this.data.uId);
    }
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

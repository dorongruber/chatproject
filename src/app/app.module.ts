import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

import { UserService } from './services/user.service';
import { MainComponent } from './main/main.component';
import { SocketService } from './services/socket.service';
import { ChatsService } from './services/chats.service';
import { UserslistComponent } from './lists/userslist/userslist.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { BackgroundComponent } from './background/background.component';
import { NewChatFormComponent } from './bottomsheet/newchatform/newchatform.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserslistComponent,
    MainComponent,
    ChatroomComponent,
    NewChatFormComponent,
    BackgroundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule,
    MatMenuModule,
    MatSidenavModule,
    MatBottomSheetModule,
    BrowserAnimationsModule
  ],
  providers: [
    UserService,
    SocketService,
    ChatsService
  ],
  entryComponents: [
    NewChatFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

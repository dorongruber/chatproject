import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackgroundComponent } from './background/background.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { UserslistComponent } from './lists/userslist/userslist.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {path: '', component: BackgroundComponent,
children: [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
]},
  {path: 'main/:id', component: MainComponent,
children: [
  {path: 'userList/:id', component: UserslistComponent}
]},
  {path: 'chat/:uid/:chatName', component: ChatroomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

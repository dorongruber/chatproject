import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router} from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hide = true;
  login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userservice: UserService
  ) {}

  Login(userlog: FormGroup) {
    console.log('userlog -> ', userlog);
    const user = ({
      email: userlog.value.email,
      password: userlog.value.password
    });

    // console.log('user -> ', user);
    this.userservice.LoginUser(user).subscribe(res => {
      if (res.userid === 'error' || res.userid === undefined) {
        this.snackBar.open('invalide username/password pair ', 'close', {
          duration: 2500,
          panelClass: 'mat-snack-bar-handset',
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      } else {
        // console.log('connected user -> ', user);
        // this.router.navigate(['/main', {id: res.userid}]);
        this.router.navigateByUrl(`/main/${res.userid}`);
      }
    });
  }

}

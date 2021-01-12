import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { DbUserFormat } from '../models/userDB.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  newuser: DbUserFormat;
  hide = true;
  state = true;
  register = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private router: Router,
    private userservice: UserService,
    private snackBar: MatSnackBar
  ) {}

  Registration(formuser: FormGroup) {
    console.log('Registration -> ', formuser);
    if (formuser.value.name === ''
    || formuser.value.phone === ''
    || formuser.value.email === ''
    || formuser.value.password === '') {
      this.snackBar.open(' Fill in the blank fields ', 'close', {
        duration: 2500,
        panelClass: 'mat-snack-bar-handset',
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } else {

      this.newuser = ({
      name: formuser.value.name,
      phone: formuser.value.phone,
      email: formuser.value.email,
      password: formuser.value.password
    });
      this.userservice.RegisterUser(this.newuser);
      this.router.navigate(['login']);
    }
  }


}

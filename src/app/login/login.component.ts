import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router} from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LocalStorage = window.localStorage;
  emailError: string;
  passwordError: string;
  hide = true;
  login = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
    ]),
  });
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userservice: UserService
  ) {}

  Login(userlog: FormGroup) {
    console.log('userlog -> ', userlog);
    if ( userlog.invalid) {
      this.CheckValidations(userlog);
    } else {
      const user = ({
        email: userlog.value.email,
        password: userlog.value.password
      });

      // console.log('user -> ', user);
      this.userservice.LoginUser(user).subscribe(res => {
        console.log('login user res -> ', res);
        if (res.userid === 'error' || res.userid === undefined) {
          this.snackBar.open('invalide username/password pair ', 'close', {
            panelClass: 'mat-snack-bar-handset',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        } else {
          console.log('connected user -> ', res.token);
          // this.router.navigate(['/main', {id: res.userid}]);
          this.LocalStorage.removeItem('token');
          this.LocalStorage.setItem('token', res.token);
          this.router.navigateByUrl(`/main/${res.userid}`);
        }
      });
    }

  }

  CheckValidations(userlog: FormGroup) {
    const results = this.getFormValidationErrors(userlog);
    console.log('results -> ', results);
    results.forEach(res => {
      switch (res.error) {
        case 'required':
          // console.log('name validation error -> ');
          this.ShowError(res.control, res.error);
          break;
        case 'minlength':
          this.ShowMinlengthError(res.control);
          break;
        case 'maxlength':
          this.ShowMaxlengthError(res.control);
          break;
        case 'pattern':
          this.ShowPatternError(res.control);
          break;
        case 'email':
          this.ShowError(res.control, 'address invalid ');
          break;
      }
    });
  }

  ShowError(controlname: string, errText: string) {
    switch (controlname) {
      case 'email':
        this.emailError = `${controlname} ${errText}`;
        break;
      case 'password':
        this.passwordError = `${controlname} ${errText}`;
        break;
    }
  }

  ShowMinlengthError(controlname: string) {
    switch (controlname) {
      case 'password':
        this.passwordError = `${controlname} min length is 6`;
    }
  }

  ShowMaxlengthError(controlname: string) {
    switch (controlname) {
      case 'password':
        this.passwordError = `${controlname} max length is 12`;
    }
  }

  ShowPatternError(controlname: string) {
    switch (controlname) {
      case 'password':
        this.passwordError = `passworm mast contain upperCase, lowerCase, number`;
    }
  }


  getFormValidationErrors(form: FormGroup) {
    const result: any[] = [];
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if ( controlErrors ) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            control: key,
            error: keyError,
            value: controlErrors[keyError]
        });
      });
    }
  });
    return result;
  }

}

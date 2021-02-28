import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  nameError: string;
  phoneError: string;
  emailError: string;
  passwordError: string;

  titlesArray = [
    'Enter Full Name',
    'Enter Phone Number',
    'Enter Email Address',
    'Enter Password'
 ];
  newuser: DbUserFormat;
  hide = true;
  state = true;
  register = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
      Validators.pattern(new RegExp('([a-zA-Z]+)(\\s{1,2})([a-zA-Z]+)'))
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[0]{1}[5]{1}[0247]{1}[0-9]{7}')
    ]),
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
    private userservice: UserService,
    private snackBar: MatSnackBar
  ) {}

  Registration(formuser: FormGroup) {
    console.log('Registration -> ', formuser);

    if (formuser.invalid) {
      this.CheckValidations();

    } else {

      this.newuser = ({
      name: formuser.value.name,
      phone: formuser.value.phone,
      email: formuser.value.email,
      password: formuser.value.password
    });
      console.log('register new user -> ', this.newuser);
      this.userservice.RegisterUser(this.newuser);
      this.router.navigate(['login']);
    }


  }

  CheckValidations() {
    const results = this.getFormValidationErrors(this.register);
    console.log('results -> ', results);
    results.forEach(res => {
      switch (res.error) {
        case 'required':
          // console.log('name validation error -> ');
          this.ShowError(res.control, 0 , 'Full Name', res.error);
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
      }
    });
  }

  ShowError(controlname: string, index: number , titleof: string, errText: string) {
    switch (controlname) {
      case 'name':
        this.nameError = `${controlname} ${errText}`;
        break;
      case 'phone':
        this.phoneError = `${controlname} ${errText}`;
        break;
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
      case 'name':
        this.nameError = `${controlname} min length is 2`;
        break;
      case 'password':
        this.passwordError = `${controlname} min length is 6`;
    }
  }

  ShowMaxlengthError(controlname: string) {
    switch (controlname) {
      case 'name':
        this.nameError = `${controlname} max length is 25`;
        break;
      case 'password':
        this.passwordError = `${controlname} max length is 12`;
    }
  }

  ShowPatternError(controlname: string) {
    switch (controlname) {
      case 'name':
        this.nameError = `full name format => <first name><space><last name>`;
        break;
      case 'phone':
        this.phoneError = `phone format => 05<0,2,4,7><phone number>`;
        break;
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

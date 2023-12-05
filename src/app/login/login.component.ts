import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  User: any;
  resultdata: any;

  constructor(private services: ServiceService, public router: Router, private storage: AngularFireStorage, private fb: FormBuilder) {

    this.LoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnInit() {

  }
  async Submit() {
    this.User = await this.services.checkUser(this.LoginForm.controls['username'].value, this.LoginForm.controls['password'].value);
    this.resultdata = this.User;
    if (this.resultdata == '') {
      alert("login failed");
    }
    else {
      localStorage.setItem('username', this.resultdata[0].username);
      localStorage.setItem('userid', this.resultdata[0].id);
      this.router.navigate(['/home'])
        .then(() => {
          window.location.reload();
        });
    }
  }
}

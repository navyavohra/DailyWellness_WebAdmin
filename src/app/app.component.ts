import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Firebase_Project';
  btnActive: any;
  username: any;
  constructor(private router:Router){
  }
 
  ngOnInit(): void {
    if(localStorage.getItem('username') != undefined){
        this.username = localStorage.getItem('username');
    }
  }
  isActive(btn:any){
    this.btnActive = btn;
  }
  Logout(){
    localStorage.clear();
    this.router.navigate(['/login']) .then(() => {
      window.location.reload();
    });
  }
}

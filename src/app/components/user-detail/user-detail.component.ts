import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User = null;

  constructor(public authService: AuthService) {
    
  }

  ngOnInit() {
    this.authService.getUser().subscribe(
      user => {
        if (user) {
          this.user = user;
          console.log(user.displayName);
        }
      } 
    );
  }

}

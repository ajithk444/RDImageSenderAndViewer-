import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {

  isAdmin: boolean;
  userReceived = false;

  anex = '';
  emailSubject = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.isAdmin = user.loggedAsAdmin;
        this.userReceived = true;
        if (this.isAdmin) {
          this.anex = '626';
          this.emailSubject = 'operador';
        } else {
          this.anex = '627';
          this.emailSubject = 'médico';
        }
      }
    });
  }

}

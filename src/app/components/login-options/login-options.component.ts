import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login-options',
  templateUrl: './login-options.component.html',
  styleUrls: ['./login-options.component.css']
})
export class LoginOptionsComponent implements OnInit {

  adminCode = '1234';
  doctorCode = '1111';

  adminInputCode: string;
  doctorInputCode: string;

  loggedAsAdmin: boolean;

  constructor(public af: AngularFireAuth,
    private authService: AuthService) { }

  ngOnInit() {
  }

  onLoginAsAdmin() {
    if (this.adminInputCode) {
      if (this.adminInputCode === this.adminCode) {
        this.loggedAsAdmin = true;
        this.authService.googleLogin(this.loggedAsAdmin);
        console.log('Registro como admin exitoso');
      } else {
        alert('Código de registro de administrador incorrecto.');
      }
    } else {      
      alert('Porfavor ingrese el código de registro.');
    }
  }

  onLoginAsDoctor() {
    if (this.doctorInputCode) {
      if (this.doctorInputCode === this.doctorCode) {
        this.loggedAsAdmin = false;
        this.authService.googleLogin(this.loggedAsAdmin);
        console.log('Registro como doctor exitoso');
      } else {
        alert('Código de registro de doctor incorrecto.');
      }
    } else {      
      alert('Porfavor ingrese el código de registro.');
    }
  }

}

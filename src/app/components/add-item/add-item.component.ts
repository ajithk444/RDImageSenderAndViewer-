import { RegisteredDoctorsService } from './../../services/registered-doctors.service';
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  user: User;
  registeredDoctors: User[];

  item: Item = {
    title: '',
    date: '',
    doctorId: '',
    adminId: '',
    imageUrl: ''
  };

  file;

  constructor(private itemService: ItemService, private authService: AuthService, private storage: AngularFireStorage,
    private registeredDoctorsService: RegisteredDoctorsService) {

    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.registeredDoctorsService.getRegisteredDoctors().subscribe(doctors => {
      if (doctors) {
        this.registeredDoctors = doctors;
      }
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.areAllItemsFieldsFilled) {
      this.item.doctorName = this.registeredDoctors.find(i => i.uid === this.item.doctorId).displayName;
      this.item.adminId = this.user.uid;
      this.itemService.addItem(this.item, this.user.uid, this.file);
      this.item.title = '';
      this.item.date = '';
      this.item.commentary = '';
      this.item.doctorId = '';
    }
  }

  areAllItemsFieldsFilled() {
    return this.item.title !== '' && this.item.date !== '' && this.item.doctorId !== '';
  }

  fileSelected(event) {
    this.file = event.target.files[0];
  }

}

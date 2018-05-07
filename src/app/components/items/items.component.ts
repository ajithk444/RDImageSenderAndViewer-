import { AuthService } from './../../services/auth.service';
import { Item } from './../../models/item';
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import * as firebase from 'firebase/app';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[];
  editState = false;
  itemToEdit: Item;

  user: User;
  profileUrl: Observable<string | null>;
  imgSrc: string;

  diagnosisArray: string[] = ['Si tiene RD', 'No tiene RD', 'Falta evaluar más'];

  constructor(private itemService: ItemService,
    private authService: AuthService,
    private storage: AngularFireStorage) {

  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.itemService.newGetItems(this.user.uid).subscribe(items => {
          this.items = items;
          this.items.sort();
        });
      }
    });
  }

  deleteItem(event, item) {
    this.itemService.deleteItem(item);
  }

  editItem(event, item) {
    if (this.itemToEdit === item) {
      this.clearState();
    } else {
      this.editState = true;
      this.itemToEdit = item;
    }
  }

  // updateItem(item) {
  //   this.itemService.updateItemOfUser(item, this.user.uid);
  //   this.clearState();
  // }

  clearState() {
    this.editState = false;
    this.itemToEdit = null;
  }

  onViewDiagnosisClicked(item: Item) {
    item.viewDiagnosis = !item.viewDiagnosis;
  }

}

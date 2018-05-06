import { Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { User } from '../../models/user';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css']
})
export class CasesComponent implements OnInit {

  items: Item[];
  user: User;

  constructor(private itemService: ItemService, private authService: AuthService, 
    private angularFireStorage: AngularFireStorage,
    private router: Router) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.itemService.getItemsAssignedToDoctor(this.user.uid).subscribe(items => {
          this.items = items;
          this.items.sort();
        });
      }
    });
  }

}

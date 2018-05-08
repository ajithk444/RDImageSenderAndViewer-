import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Item } from '../models/item';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ItemService {

  userItemsCollection: AngularFirestoreCollection<Item>;
  itemsCollection: AngularFirestoreCollection<Item>;
  allItemsCollection: AngularFirestoreCollection<Item>;
  itemDoc: AngularFirestoreDocument<Item>;
  items: Observable<Item[]> = new Observable<Item[]>();
  imageUrlObservable: Observable<string | null>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  addedItem: Item = {
    title: '',
    date: '',
    imageUrl: ''
  };

  constructor(public afs: AngularFirestore,
    private storage: AngularFireStorage) {
    this.userItemsCollection = this.afs.collection('user-items');
    this.allItemsCollection = this.afs.collection('all-items');
  }

  getItems() {
    return this.items;
  }

  newGetItems(userId: string) {
    this.itemsCollection = this.afs.collection('all-items', ref => ref.orderBy('date', 'desc').where('adminId', '==', userId));
    return this.itemsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getItemsAssignedToDoctor(userId: string): Observable<Item[]> {
    this.itemsCollection = this.afs.collection('all-items', ref => ref.orderBy('date', 'desc').where('doctorId', '==', userId));
    return this.itemsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getSpecificItem(itemId: string): Observable<Item> {
    return this.allItemsCollection.doc(itemId).valueChanges();
  }

  addItem(item: Item, userId: string, itemFile): Observable<boolean> {
    const id = this.afs.createId();
    this.addedItem = Object.assign({}, item);
    this.addedItem.viewDiagnosis = false;
    const subject = new Subject<boolean>();
    const imageAddress = `items-images/${id}/image.dcm`;
    const task = this.storage.upload(imageAddress, itemFile);
    task.downloadURL().subscribe(url => {
      this.addedItem.imageUrl = url;
      this.addedItem.imageAddress = imageAddress;
      this.afs.collection('all-items').doc(id).set(this.addedItem);
      subject.next(true);
    });
    return subject.asObservable();
  }

  deleteItem(item: Item) {
    if (item.imageAddress) {
      this.storage.ref(`items-images/${item.id}/image.dcm`).delete();
    }
    this.allItemsCollection.doc(item.id).delete();
  }

  updateItemWithDiagnosis(item: Item, itemId: string) {
    this.allItemsCollection.doc(itemId).update(item);
  }

}

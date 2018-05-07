import { AuthService } from './auth.service';
import { Injectable} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Item } from '../models/item';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';

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

  addItem(item: Item, userId: string, itemFile) {
    const id = this.afs.createId();
    const title = item.title;
    const date = item.date;
    const adminId = item.adminId;
    const doctorId = item.doctorId;
    const doctorName = item.doctorName;
    if (itemFile != null) {
      const imageAddress = `items-images/${id}/image`;
      const task = this.storage.upload(imageAddress, itemFile);
      task.downloadURL().subscribe(url => {
        this.addItemFromConsts(id, title, date, imageAddress, doctorId, url, userId, itemFile, doctorName);
      });
    } else {
      this.afs.collection('all-items').doc(id).set(item);
    }
  }

  addItemFromConsts(id, title, date, imageAddress, doctorId, url, adminId, itemFile, doctorName) {
    this.addedItem.title = title;
    this.addedItem.date = date;
    this.addedItem.adminId = adminId;
    this.addedItem.doctorId = doctorId;
    this.addedItem.doctorName = doctorName;
    this.addedItem.imageAddress = imageAddress;
    this.addedItem.imageUrl = url;
    this.afs.collection('all-items').doc(id).set(this.addedItem);
  }

  deleteItem(item: Item) {
    if (item.imageAddress) {
      this.storage.ref(`items-images/${item.id}/image`).delete();
    }
    this.allItemsCollection.doc(item.id).delete();
  }

  updateItemWithDiagnosis(item: Item, itemId: string) {
    this.allItemsCollection.doc(itemId).update(item);
  }

}

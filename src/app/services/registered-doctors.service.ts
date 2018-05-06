import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable()
export class RegisteredDoctorsService {

  registeredDoctorsColl: AngularFirestoreCollection<User>;
  registeredDoctorsObs: Observable<User[]>;

  constructor(public afs: AngularFirestore) {
  }

  getRegisteredDoctors(): Observable<User[]> {
    this.registeredDoctorsColl = this.afs.collection('users', ref => ref.orderBy('displayName', 'desc')
      .where('loggedAsAdmin', '==', false));
    return this.registeredDoctorsColl.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data.uid = a.payload.doc.id;
        return data;
      });
    });
  }

}

import { RegisteredDoctorsService } from './../../services/registered-doctors.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
declare var dwv: any;

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

  showLoadingBar = false;

  file;
  filesAttached: FileList;
  currentFile: File;
  fileFinishedUploadingArray: boolean[] = [];
  imageIndexes: number[] = [];

  imageMissingMessageArray = ['ojo izquierdo enfoque en mácula', 'ojo izquierdo enfoque en disco óptico',
    'ojo derecho enfoque en mácula', 'ojo derecho enfoque en disco óptico'];

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

  // Plan para subir multiples DICOM
  // Cuando hago upload tengo event.target.files --> hago un for o un forEach a partir de estos files
  // El primer forEach llena un array (filesArray) de booleans en false que verifica cuantos files ya fueron subidos y sera del tamano 
  // de event.target.files
  // Despues se itera con un forEach los files y se llama al metodo addFile the item service que sube un file con 
  // un id (global para todos los files), y el index (que iteracion es)
  // Este servicio sube el file y despues tiene que verificar su tag para ver el enfoque y que ojo es
  // Se retorna esto como un subject observable el cual tendra el index y si verifico el campo del tag y cual en caso que encuentre
  // Con este index pongo true al array de filesArray en el index deseado y si cumple un campo hago un check a un checkbox
  // Siempre en cada subscribe se verifica si ya se lleno filesArray para decir si se termino de subir todos los files o no
  // Despues de esto en caso que se cumplan todos los campos de los tags deseados se borran todos los files 
  // y se vuelven a subir con el image address que indique el enfoque y que ojo es
  // Otra opcion es subir un array que indique en funcion a los indices cual es cual (Ej en el index 1 se tiene el enfoque
  // macula ojo derecho) Ventaja no se vuelven a subir los archivos
  // En caso que no se cumplan todos los campos se indica cual falta pero no se borran los files  

  onSubmitMultipleItems() {
    if (this.areAllItemsFieldsFilled) {
      // let index: number;        
      const id = this.itemService.afs.createId();
      for (let e = 0; e < this.filesAttached.length; e++) {
        this.fileFinishedUploadingArray.push(false);
      }

      this.item.doctorName = this.registeredDoctors.find(i => i.uid === this.item.doctorId).displayName;
      this.item.adminId = this.user.uid;

      let missingImageMessage = 'Faltan las siguiente imágenes: ';

      for (let index = 0; index < this.filesAttached.length; index++) {
        this.currentFile = this.filesAttached[index];
        this.itemService.addItemFilesToStorage(this.item, this.user.uid, this.currentFile, index, id).subscribe(tagsValue => {
          if (tagsValue) {
            console.log('tagsValue: ', tagsValue);
            console.log('index: ', index);
            if (tagsValue.tagsFound) {
              if (tagsValue.laterality.trim() === 'L' && tagsValue.seriesDescription.trim() === 'Macula') {
                this.imageIndexes[0] = index;
              } else if (tagsValue.laterality.trim() === 'L' && tagsValue.seriesDescription.trim() === 'DiscoOptico') {
                this.imageIndexes[1] = index;
              } else if (tagsValue.laterality.trim() === 'R' && tagsValue.seriesDescription.trim() === 'Macula') {
                this.imageIndexes[2] = index;
              } else if (tagsValue.laterality.trim() === 'R' && tagsValue.seriesDescription.trim() === 'DiscoOptico') {
                this.imageIndexes[3] = index;
              }
            }
            this.fileFinishedUploadingArray[index] = true;
            if (this.allFilesFinishedUploading()) {
              this.showLoadingBar = false;
              let missingImage = false;
              console.log('imageIndexes: ', this.imageIndexes);
              for (let i = 0; i < 4; i++) {
                if (this.imageIndexes[i] == null) {
                  console.log('missing! index: ', i);
                  missingImage = true;
                  missingImageMessage = missingImageMessage + this.imageMissingMessageArray[i] + ', ';
                }
              }
              if (!missingImage) {
                alert('Todo se encontro! :)');
              } else {
                alert(missingImageMessage);
              }
              this.fileFinishedUploadingArray = [];
            }
          }
        });
      }
      this.showLoadingBar = true;
      this.clearItem();
    }
  }

  allFilesFinishedUploading(): boolean {
    for (let e = 0; e < this.fileFinishedUploadingArray.length; e++) {
      if (!this.fileFinishedUploadingArray[e]) {
        return false;
      }
    }
    return true;
  }

  onSubmit() {
    if (this.areAllItemsFieldsFilled) {
      this.item.doctorName = this.registeredDoctors.find(i => i.uid === this.item.doctorId).displayName;
      this.item.adminId = this.user.uid;
      this.itemService.addItem(this.item, this.user.uid, this.file).subscribe(value => {
        if (value) {
          console.log('value: ', value);
          this.showLoadingBar = false;
        }
      });
      this.showLoadingBar = true;
      this.clearItem();
    }
  }

  clearItem() {
    this.item.title = '';
    this.item.date = '';
    this.item.commentary = '';
    this.item.doctorId = '';
  }

  areAllItemsFieldsFilled() {
    return this.item.title !== '' && this.item.date !== '' && this.item.doctorId !== '' && this.file;
  }

  fileSelected(event) {
    this.file = event.target.files[0];
    this.filesAttached = event.target.files;
  }

}

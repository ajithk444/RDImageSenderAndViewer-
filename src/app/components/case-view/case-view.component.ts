import { AngularFireStorage } from 'angularfire2/storage';
import { ItemService } from './../../services/item.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../models/item';
import { Location } from '@angular/common';

declare var dwv: any;

@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.css']
})
export class CaseViewComponent implements OnInit {

  caseId: string;
  item: Item;
  patientSex = 'M';
  patientBloodType: string;
  patientRace: string;
  itemReceived = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private location: Location,
    private storage: AngularFireStorage) {
  }

  ngOnInit() {
    this.caseId = this.route.snapshot.queryParamMap.get('caseId');
    this.itemService.getSpecificItem(this.caseId).subscribe(item => {
      if (item) {
        this.item = item;
        this.itemReceived = true;
        // this.initializePatientInfo();
      }
    });
  }

  initializePatientInfo() {

    const onload = () => {
      // setup the dicom parser
      const dicomParser = new dwv.dicom.DicomParser();
      // parse the buffer
      dicomParser.parse(request.response);

      // div to display text
      const div = document.getElementById('tags');

      // get the wrapped dicom tags
      const tags = dicomParser.getDicomElements();

      // display the modality
      div.appendChild(document.createTextNode(
        'Sexo del paciente: ' + tags.getFromName('PatientSex')
      ));

      console.log('patientSex: ', tags.getFromName('PatientSex'));
      // this.patientSex = tags.getFromName('PatientSex');

      // break line
      div.appendChild(document.createElement('br'));

      // display the modality
      div.appendChild(document.createTextNode(
        'Fecha de nacimiento: ' + tags.getFromName('PatientBirthDate').substr(6, 2) + '/'
        + tags.getFromName('PatientBirthDate').substr(4, 2) + '/'
        + tags.getFromName('PatientBirthDate').substr(0, 4)
      ));

      // break line
      div.appendChild(document.createElement('br'));

      // display the modality
      div.appendChild(document.createTextNode(
        'Etnicidad del paciente: ' + tags.getFromName('EthnicGroup')
      ));
      // break line
      div.appendChild(document.createElement('br'));
    };

    const request = new XMLHttpRequest();
    request.open('GET', this.item.imageIndexes[0], true);
    request.responseType = 'arraybuffer';
    request.onload = onload;
    request.send(null);
  }

  onSubmit() {
    console.log('Llego aca');
    console.log(this.item.commentary, this.item.intensity);
    this.item.diagnosed = true;
    this.itemService.updateItemWithDiagnosis(this.item, this.caseId);
    this.location.back();
  }

  onCancel() {
    this.location.back();
  }

  onIntensityValueClicked(intensity: string) {
    console.log(intensity);
  }

}

import { ItemService } from './../../services/item.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../models/item';
import {Location} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.css']
})
export class CaseViewComponent implements OnInit {

  caseId: string;
  item: Item;
  patientSex: string;
  patientBloodType: string;
  patientRace: string;
  itemReceived = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private location: Location) { 
      this.initializePatientInfo();
    }

  ngOnInit() {
    this.caseId = this.route.snapshot.queryParamMap.get('caseId');
    this.itemService.getSpecificItem(this.caseId).subscribe(item => {
      if (item) {
        this.item = item;
        this.itemReceived = true;
      }
    });

  }

  initializePatientInfo() {
    this.patientSex = 'masculino';
    this.patientBloodType = 'A+';
    this.patientRace = 'amerindio';
  }

  onSubmit() {
    console.log('Llego aca');
    console.log(this.item.commentary, this.item.intensity);
    this.item.diagnosed = true;
    this.itemService.updateItemOfUser(this.item, this.caseId);
    this.location.back();
  }

  onCancel() {
    this.location.back();
  }

  changeEyeImage(focus: string) {

  }

  onIntensityValueClicked(intensity: string) {
    console.log(intensity);
  }

}

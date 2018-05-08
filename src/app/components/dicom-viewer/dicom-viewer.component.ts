import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

declare var dwv: any;

@Component({
  selector: 'app-dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.css']
})
export class DicomViewerComponent implements OnInit {

  dicomUrl: string;

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.dicomUrl = this.route.snapshot.queryParamMap.get('dicomUrl');
    
    console.log('dicomUrl', this.dicomUrl);

      // base function to get elements
      dwv.gui.getElement = dwv.gui.base.getElement;
      dwv.gui.displayProgress = function (percent) { };

      // create the dwv app
      const app = new dwv.App();
      // initialise with the id of the container div
      app.init({
        'containerDivId': 'dwv'
      });
      // load dicom data
      app.loadURLs([this.dicomUrl]);
  }

}

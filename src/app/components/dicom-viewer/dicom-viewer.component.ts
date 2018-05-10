import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';

declare var dwv: any;


// gui overrides

// decode query
dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;
// progress
dwv.gui.displayProgress = function () { };
// window
dwv.gui.getWindowSize = dwv.gui.base.getWindowSize;
// get element
dwv.gui.getElement = dwv.gui.base.getElement;
// refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement;

// Image decoders (for web workers)
dwv.image.decoderScripts = {
  'jpeg2000': 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
  'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
  'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js'
};

// Tags table
dwv.gui.DicomTags = dwv.gui.base.DicomTags;

// Get the Item Tag.
dwv.dicom.getItemTag = function () {
  return new dwv.dicom.Tag('0xFFFE', '0xE000');
};

@Component({
  selector: 'app-dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.css']
})
export class DicomViewerComponent implements OnInit {

  dicomUrl: string;
  private dwvApp: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.dicomUrl = this.route.snapshot.queryParamMap.get('dicomUrl');

    // create the dwv app
    this.dwvApp = new dwv.App();
    // initialise with the id of the container div
    this.dwvApp.init({
      'containerDivId': 'dwv',
      'fitToWindow': true,
      'tools': ['Scroll', 'WindowLevel', 'ZoomAndPan'],
      'shapes': ['Ruler'],
      'isMobile': false
    });
    // load dicom data 
    this.dwvApp.loadURLs([this.dicomUrl]);

    this.tagsPart();
  }

  tagsPart() {

    console.log('dicomUrl: ', this.dicomUrl);

    const onload = function () {
      // setup the dicom parser
      const dicomParser = new dwv.dicom.DicomParser();
      // parse the buffer
      dicomParser.parse(this.response);

      // div to display text
      const div = document.getElementById('tags');

      // get the raw dicom tags
      const rawTags = dicomParser.getRawDicomElements();
      // display the modality
      div.appendChild(document.createTextNode(
        'Patient sex: ' + rawTags.x00100040.value[0]
      ));

      // break line
      div.appendChild(document.createElement('br'));

      // get the wrapped dicom tags
      const tags = dicomParser.getDicomElements();
      // display the modality
      div.appendChild(document.createTextNode(
        'Modality (bis): ' + tags.getFromName('PatientSex')
      ));
    };

    const request = new XMLHttpRequest();
    request.open('GET', this.dicomUrl, true);
    request.responseType = 'arraybuffer';
    request.onload = onload;
    request.send(null);
  }

  onClick(event) {
    if (this.dwvApp) {
      console.log('llego acaaaaa');
      this.dwvApp.onChangeTool(event);
    }
  }

  goBack() {
    this.location.back();
  }

}

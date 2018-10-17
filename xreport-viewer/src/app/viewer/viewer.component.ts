import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ReportMeta } from '../model/report-meta';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as xreportEmbed from 'xreport-embed';
import { NgProgress } from '@ngx-progressbar/core';
import { ClipboardService } from 'ngx-clipboard'
import * as firebase from 'firebase';
import { Location } from '@angular/common';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<ReportMeta>;
  item: Observable<ReportMeta>;
  closeResult: string;
  private editorMode: boolean;
  private SERVERTIME = firebase.firestore.FieldValue.serverTimestamp();
  private downloadURL;

  constructor(private route: ActivatedRoute, 
              private afs: AngularFirestore, 
              private modalService: NgbModal, 
              public progress: NgProgress,
              private clipboardService: ClipboardService,
              private storage: AngularFireStorage,
              private location: Location)  { 
    
  }

  newReporting(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'yes') {
        window.location.reload();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 

    if (id === "new") {
      this.initBuilder();
    } else {
      this.getTemplate();
    }
  }

  saveTemplate(): void {
    let templateForUpload = xreportEmbed.getTemplateForUpload();
    const templateId = this.afs.collection('reports').ref.doc().id;
    const storageRef = this.storage.ref(`templates/${templateId}.json`);
    this.storage.upload(`templates/${templateId}.json`, templateForUpload.templateJSON)
    .then((result) => {
      storageRef.getDownloadURL().pipe(
        switchMap(url => {
          let report = {
            category: "NR",
            //TODO: auth
            creator: "anonymous",
            name: templateForUpload.title,
            createdAt: this.SERVERTIME,
            contentUrl: url
          }

          return this.afs.collection<ReportMeta>('reports').add(report);
        })).subscribe();
    }).catch((error) => {
      console.log(error);
    });
  }

  discardTemplate(): void {
    this.location.back();
  }

  initBuilder(): void {
    this.editorMode = true;

    xreportEmbed.makeWidget(
      null, //Template url
      "",  //Template name
      "div-card-holder", //DOM element to inject widget to
      ).then(() => {
        this.progress.complete();
        console.log("Content loaded");
      });
  }

  getTemplate(): void {
    this.editorMode = false;
    const id = this.route.snapshot.paramMap.get('id'); 
    this.itemDoc = this.afs.doc<ReportMeta>(`reports/${id}`);
    this.progress.start();

    this.itemDoc.valueChanges().subscribe(report => {
      xreportEmbed.makeWidget(
        report.contentUrl, //Template url
        report.name,  //Template name
        "div-card-holder", //DOM element to inject widget to
        ).then(() => {
          this.progress.complete();
          console.log("Content loaded");
        });
    });
  }

  togglePreviewMode(): void {
    xreportEmbed.togglePreviewMode();
  }

  copyReportToClipboard(): void {
    this.clipboardService.copyFromContent(xreportEmbed.getReportAsText());
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, finalize, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ReportMeta } from '../model/report-meta';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as xreportEmbed from 'xreport-embed';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { ClipboardService } from 'ngx-clipboard'
import * as firebase from 'firebase';
import { Location } from '@angular/common';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { NavVisibilityService } from '../services/nav-visibility.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<ReportMeta>;
  item: Observable<ReportMeta>;
  closeResult: string;
  private SERVERTIME = firebase.firestore.FieldValue.serverTimestamp();
  private editorModeSubject = new BehaviorSubject<Boolean>(false);
  public editorMode: Observable<Boolean>;
  private savingTemplate = false;
  private ngProgressRef: NgProgressRef

  constructor(private route: ActivatedRoute, 
              private afs: AngularFirestore, 
              private modalService: NgbModal, 
              public progress: NgProgress,
              private clipboardService: ClipboardService,
              private storage: AngularFireStorage,
              private location: Location,
              private navVisibilityService: NavVisibilityService,
              private analytics: AngularFireAnalytics)  {
      this.navVisibilityService.hideNav();
      this.ngProgressRef = progress.ref();
      this.editorMode = this.editorModeSubject.asObservable();
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
      this.analytics.logEvent("template_new_clicked");
    } else {
      this.route.queryParams.subscribe(params => {
        let mode = params["mode"];
        this.getTemplate(mode);
      });
    }
  }

  saveTemplateHandler(content): void {
    const routeId = this.route.snapshot.paramMap.get('id'); 

    if (routeId === "new") {
      this.saveTemplate(null);
    } else {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.saveTemplate(result);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  } 

  saveTemplate(mode: string): void {
    if (this.savingTemplate) {
      return;
    }

    this.ngProgressRef.start();
    this.savingTemplate = true;
    let templateForUpload = xreportEmbed.getTemplateForUpload();
    const routeId = this.route.snapshot.paramMap.get('id'); 
    let templateId;
    let updateOperation = false;

    if (routeId !== "new" && mode === "modify") {
      templateId = routeId;
      updateOperation = true;
    } else {
      templateId = this.afs.collection('reports').ref.doc().id;
    }

    const storageRef = this.storage.ref(`templates/${templateId}.json`);

    this.storage.upload(`templates/${templateId}.json`, templateForUpload.templateJSON)
    .then((result) => {
      return new Promise((resolve, reject) => {
        storageRef.getDownloadURL().pipe(
          tap(url => {
            let report = {
              category: "NR",
              //TODO: auth
              creator: "anonymous",
              name: templateForUpload.title,
              createdAt: this.SERVERTIME,
              contentUrl: url,
              status: "draft"
            }

            if (updateOperation) {
              resolve(this.afs.doc<ReportMeta>(`reports/${templateId}`).update(report));
            } else { 
              resolve(this.afs.collection<ReportMeta>('reports').add(report));
            }
          })).subscribe(() => {
            this.analytics.logEvent("template_saved");
          }, error => {
            this.analytics.logEvent("template_save_error");
            reject(error);
          });
      });
    }).then(()=> {
      this.savingTemplate = false;
      this.ngProgressRef.complete();
      this.location.back();
    }).catch((error) => {
      this.savingTemplate = false;
      this.ngProgressRef.complete();
      console.log(error);
    });
  }

  discardTemplate(): void {
    this.location.back();
    this.analytics.logEvent("template_discarded");
  }

  shareTemplate(): void {
    const templateId = this.route.snapshot.paramMap.get('id');
    this.analytics.logEvent("template_shared", { templateId: templateId});
    this.clipboardService.copyFromContent(window.location.href);
  }

  initBuilder(): void {
    this.editorModeSubject.next(true);

    xreportEmbed.makeWidget(
      null, //Template url
      "",  //Template name
      "div-card-holder", //DOM element to inject widget to
      ).then(() => {
        this.ngProgressRef.complete();
        console.log("Content loaded");
      }).catch(error => {
        this.ngProgressRef.complete();
        console.log(error);
      });
  }

  getTemplate(mode): void {
    this.editorModeSubject.next(mode === "builder");
    const id = this.route.snapshot.paramMap.get('id'); 
    this.itemDoc = this.afs.doc<ReportMeta>(`reports/${id}`);
    this.ngProgressRef.start();

    this.itemDoc.valueChanges().subscribe(report => {
      xreportEmbed.makeWidget(
        report.contentUrl, //Template url
        report.name,  //Template name
        "div-card-holder", //DOM element to inject widget to
        mode === "builder" //'builder' or 'viewer'
        ).then(() => {
          this.analytics.logEvent("template_viewed", { templateId: id});
          this.ngProgressRef.complete();
          console.log("Content loaded");
        }).catch(error => {
          this.analytics.logEvent("template_view_error", { templateId: id});
          this.ngProgressRef.complete();
          console.log(error);
        });
    });
  }

  togglePreviewMode(): void {
    xreportEmbed.togglePreviewMode();
  }

  copyReportToClipboard(): void {
    this.clipboardService.copyFromContent(xreportEmbed.getReportAsText());
    this.analytics.logEvent("copy_report");
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ReportMeta } from '../model/report-meta';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as xreportEmbed from 'xreport-embed';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<ReportMeta>;
  item: Observable<ReportMeta>;
  closeResult: string;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private modalService: NgbModal)  { 
    
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
    this.getTemplate();
  }

  getTemplate(): void {
    const id = this.route.snapshot.paramMap.get('id'); 
    this.itemDoc = this.afs.doc<ReportMeta>(`reports/${id}`);
    this.itemDoc.valueChanges().subscribe(report => {
      xreportEmbed.makeWidget(report.contentUrl, report.name, "div-card-holder");
    });
  }

  genReportOutput(): void {
    xreportEmbed.genReportOutput();
  }
}

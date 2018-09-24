import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportMeta } from '../model/report-meta';
import { ReportMetaId } from '../model/report-meta-id';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-template-browser',
  templateUrl: './template-browser.component.html',
  styleUrls: ['./template-browser.component.css']
})
export class TemplateBrowserComponent implements OnInit {

  reports: Observable<ReportMetaId[]>;

  constructor(db: AngularFirestore, private router: Router) {
    this.reports = db.collection('reports').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ReportMeta;
        const id = a.payload.doc.id;
        data.createdAt = moment(data.createdAt).fromNow();
        return { id, ...data };
      })));
    }

  ngOnInit() {
  }

  view(report: ReportMetaId): void {
    this.router.navigate([`/templates/${report.id}`]);
  }
}

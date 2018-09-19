import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-template-browser',
  templateUrl: './template-browser.component.html',
  styleUrls: ['./template-browser.component.css']
})
export class TemplateBrowserComponent implements OnInit {

  reports: Observable<any>;

  constructor(db: AngularFirestore) {
    this.reports = db.collection('reports').valueChanges();
   }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ReportMeta } from '../model/report-meta';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<ReportMeta>;
  item: Observable<ReportMeta>;
  
  constructor(private route: ActivatedRoute, private afs: AngularFirestore) { 
    
  }

  ngOnInit() {
  }

  getTemplate(): void {
    const id = +this.route.snapshot.paramMap.get('id'); 
    this.itemDoc = this.afs.doc<ReportMeta>(`reports/${id}`);
    this.item = this.itemDoc.valueChanges();
  }
}

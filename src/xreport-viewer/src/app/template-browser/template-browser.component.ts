import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportMeta } from '../model/report-meta';
import { ReportMetaId } from '../model/report-meta-id';
import { Category } from '../model/category';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NavVisibilityService } from '../services/nav-visibility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-template-browser',
  templateUrl: './template-browser.component.html',
  styleUrls: ['./template-browser.component.css']
})
export class TemplateBrowserComponent implements OnInit, AfterViewInit {

  @ViewChild('proUpsell') proUpsell: TemplateRef<any>;

  reports: Observable<ReportMetaId[]>;
  categories: Observable<Category[]>;
  selectedCategories: Category[] = [];

  private readonly proUpsellSeenKey = 'xreportProUpsellSeen';

  constructor(private db: AngularFirestore, private router: Router, private navVisibilityService: NavVisibilityService, private modalService: NgbModal) {
    this.navVisibilityService.showNav();
    this.reports = db.collection('reports').snapshotChanges().pipe(
      map(reps => reps.map(rep => {
        const data = rep.payload.doc.data() as ReportMeta;
        const id = rep.payload.doc.id;
        data.createdAt = moment(data.createdAt.toDate()).fromNow();
        data.category = db.doc<Category>(`categories/${data.category}`).valueChanges();
        return { id, ...data };
      })));

    this.categories = db.collection('categories').snapshotChanges().pipe(
      map(categs => categs.map(categ => {
        const data = categ.payload.doc.data();
        const id = categ.payload.doc.id;
        const category = new Category();
        category.id = id;
        category.name = data["name"];
        
        return category;
      })));
    }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (!localStorage.getItem(this.proUpsellSeenKey)) {
      localStorage.setItem(this.proUpsellSeenKey, 'true');
      // Defer to avoid ExpressionChangedAfterItHasBeenChecked during the same change detection cycle.
      setTimeout(() => this.openProUpsell(false));
    }
  }

  editTemplate(report: ReportMetaId): void {
    this.router.navigate([`/templates/${report.id}`], { queryParams: { mode: "builder" }});
  }

  newReport(): void {
    this.openProUpsell(true);
  }

  private openProUpsell(navigateToLegacyOnStay: boolean): void {
    this.modalService.open(this.proUpsell).result.then(result => {
      if (result === 'pro') {
        window.open('https://xreport.pro', '_blank');
      } else if (result === 'legacy' && navigateToLegacyOnStay) {
        this.router.navigate(['/templates/new']);
      }
    }, () => {});
  }

  view(report: ReportMetaId): void {
    this.router.navigate([`/templates/${report.id}`], { queryParams: { mode: "viewer" }});
  }

  selectCategory(category: Category): void {
    this.reports = this.db.collection('reports', ref => ref.where('category', '==', category.id)).snapshotChanges().pipe(
      map(reps => reps.map(rep => {
        const data = rep.payload.doc.data() as ReportMeta;
        const id = rep.payload.doc.id;
        data.createdAt = moment(data.createdAt.toDate()).fromNow();
        data.category = this.db.doc<Category>(`categories/${data.category}`).valueChanges();
        return { id, ...data };
      })));
  }
}

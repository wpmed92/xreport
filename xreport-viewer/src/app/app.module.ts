import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { TemplateBrowserComponent } from './template-browser/template-browser.component';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './nav/nav.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressModule } from '@ngx-progressbar/core';

@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    TemplateBrowserComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgbModule,
    NgProgressModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

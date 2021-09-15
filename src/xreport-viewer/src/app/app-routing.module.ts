import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateBrowserComponent } from './template-browser/template-browser.component';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
  { path: '',   redirectTo: '/templates', pathMatch: 'full' },
  { path: 'templates', component: TemplateBrowserComponent },
  { path: 'templates/:id', component: ViewerComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

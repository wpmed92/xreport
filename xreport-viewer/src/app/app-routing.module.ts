import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateBrowserComponent } from './template-browser/template-browser.component';

const routes: Routes = [
  { path: '', component: TemplateBrowserComponent },
  { path: 'templates', component: TemplateBrowserComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

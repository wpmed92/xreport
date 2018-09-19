import { Component } from '@angular/core';
import * as xreportEmbed from 'xreport-embed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'xreport-viewer';
  
  ngOnInit() {
    xreportEmbed.makeWidget("https://firebasestorage.googleapis.com/v0/b/xreport-f792c.appspot.com/o/reports%2FKiC68eSAdqB3IOqiMzJN?alt=media&token=299c5c1e-493f-4ea5-88ff-47218796c080", "test-div");
  }
}



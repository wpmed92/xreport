import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavVisibilityService {
  private navVisibleSubject = new BehaviorSubject<boolean>(true);
  public isNavVisible: Observable<boolean>;

  constructor() { 
    this.isNavVisible = this.navVisibleSubject.asObservable();
  }

  showNav() {
    this.navVisibleSubject.next(true);
  }

  hideNav() {
    this.navVisibleSubject.next(false);
  }
}

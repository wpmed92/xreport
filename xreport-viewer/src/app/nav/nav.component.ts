import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { NavVisibilityService } from '../services/nav-visibility.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService, private navVisibilityService: NavVisibilityService) {

  }

  ngOnInit() {
  }
}

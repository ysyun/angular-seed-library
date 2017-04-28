import { Component } from '@angular/core';
import { RouterService } from '../router.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent {

  constructor(private _router: RouterService) { }
  
  go(url: string) {
    this._router.go(url);
  }
}

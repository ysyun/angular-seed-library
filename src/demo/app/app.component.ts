import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';
import { ApiConfig } from './shared/config/api.config';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  constructor(private api: ApiConfig) {
    console.log('api config: message.request is', api.getConfig('message.request'));
    console.log('Environment config', Config);
  }
}

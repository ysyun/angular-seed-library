import { Component, OnInit } from '@angular/core';
import { ApiConfig } from '../shared/config/api.config';
import { RequestConfig, RestfulService } from '../shared/util/restful.service';

@Component({
    moduleId: module.id,
    selector: 'stub-api',
    template: ` 
        <h3> This is Stub Api sample page</h3>
        <br>
        <div (click)="login()" style="margin-left:30px;cursor:pointer;font-size:150%">login</div>
        <br>
        <div style="margin-left:30px;">{{loginJson | json}}</div>
        <br>
        <div (click)="logout()" style="margin-left:30px;cursor:pointer;font-size:150%">logout</div>
        <br>
        <div style="margin-left:30px;">{{logoutJson | json}}</div>
    `
})

export class StubAPIComponent {

    loginJson: any;
    logoutJson: any;

    constructor(
        private api: ApiConfig,
        private rest: RestfulService
    ) { }

    login() {
        const request: RequestConfig = {
            url: this.api.getConfig('login.request')
        };

        this.rest
            .request(request)
            .then((response: any) => this.loginJson = response);
    }

    logout() {
        const request: RequestConfig = {
            url: this.api.getConfig('logout.request')
        };

        this.rest
            .request(request)
            .then((response: any) => this.logoutJson = response);
    }
}

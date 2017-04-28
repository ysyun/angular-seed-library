import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RouterService {

    constructor(private _router: Router) { }

    go(url: string) {
        let params: any = {};
        if (window.location.search) {
            params = this.parse(window.location.search);
        }
        this._router.navigate([url], { queryParams: params });
    }

    parse(str: string) {
        let ret: any = {};
        if (str.indexOf('?') === 0) {
            str = str.split('?')[1];
        }

        str.split('&').forEach((param: string) => {
            let parts = param.replace(/\+/g, ' ').split('=');
            let key = parts.shift();
            let val = parts.length > 0 ? parts.join('=') : undefined;

            key = decodeURIComponent(key);
            val = val === undefined ? null : decodeURIComponent(val);

            if (ret[key] === undefined) {
                ret[key] = val;
            } else if (Array.isArray(ret[key])) {
                ret[key].push(val);
            } else {
                ret[key] = [ret[key], val];
            }
        });

        return ret;
    }
}
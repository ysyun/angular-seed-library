import { Injectable } from '@angular/core';

import { Config } from './env.config';
import { StorageService } from '../util/storage.service';

@Injectable()
export class ApiConfig {

    private _targetApi: any = {
        'mode': 'dev',
        'session.timeout': 60 * 60 * 1000
    };

    private _apis: any = {
        'stub': {
            'message.request': '/stubs/message.json',
            'login.request': '/stubs/login.json',
            'logout.request': '/stubs/logout.json'
        },
        'live': {
            'server.push.host': '',
            'server.push.port': '',
            'message.request': '/api/message',
            'login.request': '/auth/login',
            'logout.request': '/auth/logout'
        }
    };

    constructor(private _storage: StorageService) {
        this._initData();
    }

    getConfig(key: string) {
        let api = this._targetApi[key];
        if (!api) {
            api = this._targetApi[key];
        }

        if (api && api.url) {
            return api.url;
        } else {
            return api;
        }
    }

    _initData() {
        // Only for DEV environment
        let proxyTarget: string;
        let isStubs: boolean;
        if (Config.ENV === 'DEV') {
            proxyTarget = this._storage.getItem('proxy-target');
            if (proxyTarget && proxyTarget === 'stubs') {
                isStubs = true;
            }
            if (location.search.indexOf('proxy=') >= 0
                && location.search.split('=')[1] !== 'stubs') {
                isStubs = false;
            }
        }

        if (~location.search.indexOf('proxy=stubs') || isStubs) {
            this._targetApi = this._apis.stub;
            this._targetApi.stub = true;
        } else {
            this._targetApi = this._apis.live;
            this._targetApi.stub = false;
        }

    }
}

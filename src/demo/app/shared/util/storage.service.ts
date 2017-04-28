import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    setItem(key: string, value: any, isLocal: boolean = false) {
        let store = this._getStore(isLocal);
        store.setItem('__tm__' + key, JSON.stringify(value));
    }

    getItem(key: string, isLocal: boolean = false) {
        let store = this._getStore(isLocal);
        let value = store.getItem('__tm__' + key);
        return value ? JSON.parse(value) : null;
    }

    private _getStore(isLocal: boolean) {
        return !isLocal ? localStorage : sessionStorage;
    }
}

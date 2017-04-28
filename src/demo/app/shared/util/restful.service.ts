import { Http, RequestMethod, RequestOptions, Headers } from '@angular/http';
import { Observable,  } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

export interface RequestConfig {
    url: string;
    method?: string;
    query?: any;
    params?: any;
    header?: any;
}

@Injectable()
export class RestfulService {

    constructor(private _http: Http) { }

    request({ method = 'post', url = '', query = undefined, params = <any>{}, header = <any>{} }: RequestConfig): Promise<any> {
        if (method === 'get') {
            // Get method
            const opt = this._createOptions(params, header, RequestMethod.Get);
            return this._http.get(
                this._createUrl(url, query),
                opt.options
            )
            .map((response: any) => this._toJson(response))
            .catch(this._handleError)
            .toPromise();
        } else {
            // Post method
            const opt = this._createOptions(params, header, RequestMethod.Post);
            return this._http.post(
                this._createUrl(url, query),
                opt.body,
                opt.options
            )
            .map((response: any) => this._toJson(response))
            .catch(this._handleError)
            .toPromise();
        }
    }

    _createUrl(url: string, query: any) {
        url += query ? this._jsonToQueryString(query) : '';
        return url;
    }

    _jsonToQueryString(json: any) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    _createOptions(params: any, header: any, method: RequestMethod) {
        let headers = new Headers(
            Object.assign(
                {
                    'Content-Type': 'application/json'
                },
                header
            )
        );

        if (method === RequestMethod.Get) {
            return {
                body: '',
                options: new RequestOptions({
                    body: '',
                    search: params,
                    method,
                    headers
                })
            };
        } else {
            return {
                body: JSON.stringify(params),
                options: new RequestOptions({
                    method,
                    headers
                })
            };
        }
    }

    _toJson(response: any) {
        if (response && response._body && response._body.length > 0) {
            try {
                return response.json();
            } catch(err) {
                return response._body;
            }
            // return response.json();
        }
        return {};
    }

    _handleError(error: any) {
        let errMsg: any = {
            url: error.url,
            status: error.status,
            statusText: error.statusText,
            message: error._body
        };
        // console.error('>> AJAX error', errMsg);
        return ErrorObservable.throw(errMsg);
    }
}

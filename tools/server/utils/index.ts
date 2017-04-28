import * as path from 'path';
import * as fs from 'fs-extra';
import * as url from 'url';

export function startServer(app: any, options: any, serverName: string): any {
    let promise: any = new Promise(function(resolve: any, reject: any) {
        let server;
        if (options.server && typeof app === 'function') {
            app = options.server.on('request', app);
        }

        // this is tiny-lr livereload server
        if (serverName === 'livereload') {
            return server = app.listen(options.port, '0.0.0.0', function (err: any) {
                let ref;
                if (err) {
                    return reject(err);
                }
                this.changed = (ref = app.changed) !== null ? ref.bind(app) : void 0;
                return resolve(this);
            });
        } else {
            return server = app.listen(options.port, '0.0.0.0', 511, function (err: any) {
                let ref;
                if (err) {
                    return reject(err);
                }
                return resolve(this);
            });
        }
    });

    promise.tap = (fn: any) => {
        return promise.then((server: any) => {
            fn(server);
            return server;
        });
    };
    return promise;
}

export function readProxyAddress(env: any) {
    let cloud: any = fs.readJsonSync(path.join(process.cwd(), 'tools/config/stub_api/api-address.json'))[env];
    for (let endpoint in cloud) {
        if (typeof cloud[endpoint] === 'object') {
            cloud[endpoint] = url.format(cloud[endpoint]);
        }
    }
    return cloud;
}

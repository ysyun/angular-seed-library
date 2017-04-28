import * as express from 'express';
import * as util from 'gulp-util';
import { resolve } from 'path';
import Config from '../config';
import * as http from 'http';
import { log } from '../utils';
import { startServer } from './utils';

function report(server: any, template: any) {
    return Promise.resolve(server)
        .then((instance: any) => {
            const ref = instance.address(), address = ref.address, port = ref.port;
            return console.log('[' + util.colors.blue(Config.STUB_API_LOG_PREFIX) + '] '
                                   + util.colors.bold(template(`http://${address}:${port}/`)));
        });
}

function watch(server: any) {
    let promise: any = new Promise(function (resolve: any, reject: any) {
        return resolve(server);
    });
    return promise;
}

exports.serve = function(options: any) {
    const server = options.server = http.createServer();
    const app = express();

    // set routing based on express based on the sudeo path of expressjs
    // @see http://expressjs.com/en/starter/static-files.html
    app.use(require('connect-livereload')({ port: options.livereloadPort }))
        .use(require('./middlewares/rewriter')())
        .use(require('./middlewares/origin')())
        .use(require('./middlewares/spa')({ reload: options.reload }))
        .use(`${Config.APP_BASE}${Config.APP_SRC}`, express.static(resolve(process.cwd(), Config.APP_SRC)))
        .use(`${Config.APP_BASE}${Config.APP_DEST}`, express.static(resolve(process.cwd(), Config.APP_DEST)))
        .use(`${Config.APP_BASE}node_modules`, express.static(resolve(process.cwd(), 'node_modules')))
        .use(`${Config.APP_BASE}.replace(/\/$/, '')}`, express.static(resolve(process.cwd(), Config.APP_DEST)))
        .use(require('./middlewares/upstream')(options));

    return watch(startServer(app, options, 'web'))
        .then((server: any) => {
            console.log(util.colors.gray(' --------------------------------------------------'));
            report(server, (host: string) => {
                return 'Serving Web on ' + host;
            });
            report(options.reload, (host: string) => {
                return 'Serving LiveReload on ' + host;
            });
            report(options.api, (host: string) => {
                return 'Serving API on ' + host;
            });
            report(options.stub, (host: string) => {
                return 'Serving Stub on ' + host;
            });
            return server;
        });
};

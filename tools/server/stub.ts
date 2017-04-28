import { log } from '../utils';
import * as serveStatic from 'serve-static';
import * as express from 'express';
import * as glob from 'glob';
import * as path from 'path';
import { startServer } from './utils';
import Config from '../config';

const body = require('body-parser');
const debug = require('debug')('upstream:stub');

exports.serve = function(options: any) {

    const app = express();
    app.use(require('cookie-parser')())
        .use(body.json())
        .use(require('./middlewares/origin')());

    // set the special stub logics
    app.use('/stubs', (req: any, res: any, next: any) => {
            req.method = 'GET';
            return next();
       })
       .use(`${Config.APP_BASE}stubs`, express.static(path.resolve(process.cwd(), 'tools/stubs')));

    return startServer(app, options, 'stub')
        .tap((server: any) => {
            // console.log('> stub server', server);
        });
};

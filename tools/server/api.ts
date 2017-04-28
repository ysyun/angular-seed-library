import * as express from 'express';
import * as url from 'url';
import * as path from 'path';
import * as _ from 'underscore';
import { startServer, readProxyAddress } from './utils';
import { log } from '../utils';

const httpProxy = require('http-proxy');
const debug = require('debug')('upstream:proxy');
const forgeNotSupported = 'Proxying to forge is not supported. Please go to the forge on target environment directly';
const proxyNotConfigured = (target: any) => {
    return `API Server ${target} does not exist. Please make sure the proxy is configured in tools/config/stub_api/api-address.json`;
};
const localUseIfDefined = function (proxy: any, remoteApiAddress: any, target: any) {
    let defaults = remoteApiAddress[target];
    if (proxy !== 'local') {
        return defaults;
    }
};

exports.serve = function(options: any) {
    const upstream = httpProxy.createProxyServer({ timeout: 600000 });
    let socket2origin: any = {};
    upstream.on('error', debug);

    const app = express();
    app.use(require('cookie-parser')())
       .use(function (req: any, res: any, next: any) {
            const originTmp = require('./middlewares/origin');
            const origin: any = originTmp.parse(req);
            let remoteApiAddress: any = readProxyAddress(origin.proxy);

            if (!remoteApiAddress) {
                return next(proxyNotConfigured(origin.proxy));
            }

            if (!req.path.indexOf('/socket.io')) {
                remoteApiAddress = localUseIfDefined(origin.proxy, remoteApiAddress, 'socketio');
                res.write = _.wrap(res.write, function (fn, chunk, encoding, callback) {
                    socket2origin[chunk.toString('utf8').split(':')[0]] = origin;
                    return fn.call(this, chunk, encoding, callback);
                });
            } else {
                remoteApiAddress = localUseIfDefined(origin.proxy, remoteApiAddress, 'web');
            }
            return upstream.web(req, res, {
                target: remoteApiAddress,
                secure: false
            }, (err: any, req: any, res: any, target: any) => {
                if (typeof target === 'object') {
                    target = url.format(target);
                }
                return res.status(500).send(`Error while proxying from ${origin} to ${target}`);
            });
        });
    return startServer(app, options, 'proxy').tap((server: any) => {
        return server.on('upgrade', (req: any, socket: any, head: any) => {
            const socketId = path.basename(req.url);
            const origin = socket2origin[socketId];
            const proxy = localUseIfDefined(origin.proxy, readProxyAddress(origin.proxy), 'websocket');
            return upstream.ws(req, socket, head, {
                target: proxy,
                secure: false
            }, (err: any, req: any, socket: any) => {
                if (!err) {
                    return;
                }
                log('Please verify `tools/config/stub_api/api-address.json` is correct:');
                log(` - Duplicate entries of ${origin.proxy} may override correct setting.`);
                return log(`WebSocket proxying error ${err}`);
            });
        });
    });
};

import * as express from 'express';
import * as fallback from 'express-history-api-fallback';
import * as open from 'open';
import * as path from 'path';

import * as codeChangeTool from './code_change_tools';
import { changeFileManager } from './code_change_tools';
import Config from '../../config';

/**
 * read ports.json config
 */
let ports = require(path.join(process.cwd(), 'tools/config/stub_api/server-port.json'));

/**
 * Serves the Single Page Application.
 */
export function serveAll(cb: Function, apiTarget: string = 'stubs') {

    const params = `proxy=${apiTarget}`;

    process.on('exit', (_: any) => changeFileManager.clear());
    process.on('SIGINT', (_: any) => process.exit(1));
    process.on('SIGTERM', (_: any) => process.exit(1));

    const server = require(path.join(process.cwd(), 'tools/server/server'));

    const livereloader = require('tiny-lr')();
    codeChangeTool.setLiveReloader(livereloader);
    const reload = require(path.join(process.cwd(), 'tools/server/reload')).serve({ port: ports.livereload, tinylr: livereloader });
    const api = require(path.join(process.cwd(), 'tools/server/api')).serve({ port: ports.api });
    const stub = require(path.join(process.cwd(), 'tools/server/stub')).serve({ port: ports.stub });

    server.serve({ port: ports.web, livereloadPort: ports.livereload, reload, api, stub })
        .then((instance: any) => {
            const { port, address } = instance.address();
            open(`http://${address}:${port}/?${params}`);
        })
        .catch((e: any) => console.error('server exception', e));
}

/**
 * This utility method is used to notify that a file change has happened and subsequently calls the `changed` method,
 * which itself initiates a BrowserSync reload.
 * @param {any} e - The file that has changed.
 */
export function notifyLiveReloadAll(e: any) {
    let fileName = e.path;
    codeChangeTool.changed(fileName);
}

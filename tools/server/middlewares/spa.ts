import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import Config from '../../config';

let staticUrls = require(path.join(process.cwd(), 'tools/config/stub_api/static-uri.json'));

module.exports = function (options: any) {
    if (!options) {
        options = {};
    }

    const watcher = options.watcher;
    const reload = options.reload;

    return function (req: any, res: any, next: any) {
        const pathname = url.parse(req.url).pathname;
        let isStatic: boolean = false;
        let isIndex: boolean = false;
        if (pathname === '/') {
            isStatic = true;
            isIndex = true;
        } else {
            staticUrls.forEach((url: any) => {
                if (isStatic) { return; }
                isStatic = pathname.indexOf(url.path) === 0;
                if (isStatic) {
                    isIndex = url.index;
                    return;
                }
            });
        }

        if (isStatic) {
            let fileName: any;
            if (isIndex) {
                fileName = path.resolve(path.join(process.cwd(), Config.APP_DEST, 'index.html'));
                // fileName = path.resolve(path.join(process.cwd(), 'dist/dev/', 'index.html'));
            } else {
                fileName = path.resolve(path.join(process.cwd(), Config.APP_DEST, pathname));
                // fileName = path.resolve(path.join(process.cwd(), 'dist/dev/', pathname));
            }
            // console.log('-- filename', fileName);

            fs.readFile(fileName, (err: any, data: any) => {
                if (err) {
                    res.writeHead(404, { 'Content-type': 'text/plain' });
                    res.end('Sorry the page was not found in static web server');
                } else {
                    //  res.writeHead(202, { 'Content-type': contentType(file) });
                    res.end(data);
                }
            });
        } else if (pathname !== '/' || pathname === req.url) {
            return next();
        }
    };
};

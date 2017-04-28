import * as _ from 'underscore';
import * as url from 'url';

const rewriteHeader = (key: any, value: any, req: any) => {
    let rewritten: any;
    switch (key) {
        case 'set-cookie':
            return value.map((cookie: any) => {
                return cookie.split(/;\s*/).filter((part: any) => {
                    return part !== 'Secure';
                }).join('; ');
            });
        case 'location':
            rewritten = _.pick(url.parse(req.headers.referer), 'protocol', 'host', 'search');
            rewritten = _.extend(url.parse(value), rewritten);
            rewritten = url.format(rewritten);
            return rewritten;
        default:
            return value;
    }
};

module.exports = function (options: any) {
    if (!options) {
        options = {};
    }

    return function (req: any, res: any, next: any) {
        req.url = req.url.replace(/^\/statics/, '');
        res.setHeader = _.wrap(res.setHeader, function (fn: any, key: any, value: any) {
            return fn.call(this, key, rewriteHeader(key, value, req));
        });
        return next();
    };
};

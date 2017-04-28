import * as url from 'url';
import * as querystring from 'querystring';
import * as _ from 'underscore';

module.exports = function (options: any) {
    if (!options) {
        options = {};
    }

    return function (req: any, res: any, next: any) {
        req.origin = module.exports.parse(req);
        return next();
    };
};

module.exports.parse = function (req: any) {
    let headers, params, platform, referer, ua;

    headers = req.headers;
    ua = headers['user-agent'];
    referer = headers['referer'] || req.url;
    referer = url.parse(referer);
    platform = 'desktop';
    if (ua && ~ua.indexOf('iPad')) {
        platform = 'tablet';
    }
    params = querystring.parse(referer.query);

    return _.extend({}, params, {
        platform: platform
    });
};

import { log } from '../utils';
import { startServer } from './utils';

exports.serve = function(options: any) {
    if (!options) {
      options = {};
    }

    return startServer(options.tinylr, options, 'livereload');
};

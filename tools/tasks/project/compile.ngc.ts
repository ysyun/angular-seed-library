import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const ngc = require('@angular/compiler-cli/src/main').main;

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
export = (done: any) => {

  Promise.resolve()
    .then(() => {
      ngc({ project: `${Config.LIB_TMP_DIR}/tsconfig.json` })
        .then(() => console.log('ES2015 compilation succeeded.'));
    })
    .then(() => {
      ngc({ project: `${Config.LIB_TMP_DIR}/tsconfig.es5.json` })
        .then(() => console.log('ES5 compilation succeeded.'));
    })
    .then(() => {
      const src = [
        join(Config.LIB_ES6_DIR, '**/*.d.ts'),
        join(Config.LIB_ES6_DIR, '**/*.metadata.json')
      ];
      const result = gulp.src(src)
        .pipe(plugins.plumber())
        .once('error', function (e: any) {
          this.once('finish', () => process.exit(1));
        });

      result
        .pipe(gulp.dest(Config.LIB_DIST_DIR))
        .on('error', (e: any) => {
          console.log(e);
        });

      done();
    });
};

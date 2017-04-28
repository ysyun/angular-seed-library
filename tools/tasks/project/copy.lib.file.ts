import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
export = () => {
  const src = [
    join(Config.LIB_SRC, 'README.md'),
    join(Config.LIB_SRC, 'package.json'),
    join(Config.LIB_SRC, 'LICENSE')
  ];

  const result = gulp.src(src)
    .pipe(plugins.plumber())
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });

  return result
    .pipe(gulp.dest(Config.LIB_DIST_DIR))
    .on('error', (e: any) => {
      console.log(e);
    });
};

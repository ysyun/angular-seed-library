import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

const INLINE_OPTIONS = {
  base: Config.LIB_SRC,
  target: 'es6',
  useRelativePaths: true,
  removeLineBreaks: true
};

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
export = () => {
  const src = [
    join(Config.LIB_SRC, '**/*.ts'),
    join(Config.LIB_SRC, '**/*.d.ts'),
    join(Config.LIB_SRC, '**/*.json'),
    '!' + join(Config.LIB_SRC, '**/*.css'),
    '!' + join(Config.LIB_SRC, '**/*.html')
  ].concat(Config.EXCLUDE_COPING_FILES.map((excludefile: string) => '!' + join(Config.LIB_SRC, excludefile) ));

  const result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });

  return result
    .pipe(gulp.dest(Config.LIB_TMP_DIR))
    .on('error', (e: any) => {
      console.log(e);
    });
};

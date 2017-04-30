import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';
import { makeTsProject, TemplateLocalsBuilder } from '../../utils';

const plugins = <any>gulpLoadPlugins();

const INLINE_OPTIONS = {
  base: Config.TMP_DIR,
  target: 'es5',
  useRelativePaths: true,
  removeLineBreaks: true
};

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */

export = () => {
  let tsProject = makeTsProject({}, Config.TMP_DIR);
  let src = [
    Config.TOOLS_DIR + '/manual_typings/**/*.d.ts',
    join(Config.TMP_DIR, '**/*.ts'),
    '!' + join(Config.TMP_DIR, `**/${Config.NG_FACTORY_FILE}.ts`)
  ].concat(Config.EXCLUDE_COPING_FILES_IN_PROD.map((excludefile: string) => '!' + join(Config.APP_SRC, excludefile) ));

  let result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
    .pipe(tsProject())
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });

  // create d.ts
  result.dts
    .pipe(gulp.dest(Config.TMP_DIR));

  return result.js
    .pipe(plugins.template(new TemplateLocalsBuilder().build()))
    .pipe(gulp.dest(Config.TMP_DIR))
    .on('error', (e: any) => {
      console.log(e);
    });
};

import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/tmp` directory.
 */
export = () => {
  return gulp.src([
      join(Config.APP_SRC, '**/*.ts'),
      join(Config.APP_SRC, '**/*.json'),
      '!' + join(Config.APP_SRC, '**/*.spec.ts'),
      '!' + join(Config.APP_SRC, '**/*.e2e-spec.ts')
    ].concat(Config.EXCLUDE_COPING_FILES.map((excludefile: string) => '!' + join(Config.APP_SRC, excludefile) )))
    .pipe(gulp.dest(Config.TMP_DIR));
};

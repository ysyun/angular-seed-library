import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();
const camelCase = require('camelcase');
const path = require('path');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const sourcemaps = require('rollup-plugin-sourcemaps');

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
export = (done: any) => {
  const libName = Config.LIB_NAME;
  // Base configuration.
  const es5Entry = path.join(Config.LIB_ES5_DIR, `${libName}.js`);
  const es2015Entry = path.join(Config.LIB_ES6_DIR, `${libName}.js`);
  const rollupBaseConfig = {
    moduleName: camelCase(libName),
    sourceMap: true,
    // ATTENTION:
    // Add any dependency or peer dependency your library to `globals` and `external`.
    // This is required for UMD bundle users.
    globals: {
      // The key here is library name, and the value is the the name of the global variable name
      // the window object.
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals for more.
      '@angular/core': 'ng.core'
    },
    external: [
      // List of dependencies
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#external for more.
      '@angular/core'
    ],
    plugins: [
      sourcemaps()
    ]
  };

  // UMD bundle.
  const umdConfig = Object.assign({}, rollupBaseConfig, {
    entry: es5Entry,
    dest: path.join(Config.LIB_DIST_DIR, `bundles`, `${libName}.umd.js`),
    format: 'umd',
  });

  // Minified UMD bundle.
  const minifiedUmdConfig = Object.assign({}, rollupBaseConfig, {
    entry: es5Entry,
    dest: path.join(Config.LIB_DIST_DIR, `bundles`, `${libName}.umd.min.js`),
    format: 'umd',
    plugins: rollupBaseConfig.plugins.concat([uglify({})])
  });

  // ESM+ES5 flat module bundle.
  const fesm5config = Object.assign({}, rollupBaseConfig, {
    entry: es5Entry,
    dest: path.join(Config.LIB_DIST_DIR, `${libName}.es5.js`),
    format: 'es'
  });

  // ESM+ES2015 flat module bundle.
  const fesm2015config = Object.assign({}, rollupBaseConfig, {
    entry: es2015Entry,
    dest: path.join(Config.LIB_DIST_DIR, `${libName}.js`),
    format: 'es'
  });

  const allBundles = [
    umdConfig,
    minifiedUmdConfig,
    fesm5config,
    fesm2015config
  ].map((cfg: any) => rollup.rollup(cfg).then((bundle: any) => bundle.write(cfg)));

  Promise.all(allBundles).then(() => console.log('All bundles generated successfully.'));

  done();
};

import * as util from 'gulp-util';

export function log(msg: string) {
    console.log(`> ${util.colors.green(msg)}`);
}

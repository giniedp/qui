'use strict'

const del = require('del')
const path = require('path')
const gulp = require('gulp')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const shell = require('shelljs')
const rollup = require('rollup')

const dstDir = path.join(__dirname, 'dist')
const srcDir = path.join(__dirname, 'src')

gulp.task('clean', () => del(dstDir))

gulp.task('build:tsc', (cb) => {
  shell
    .exec('tsc -p tsconfig.json', { async: true })
    .on('exit', (code) => {
      if (code === 0) {
        cb()
      } else {
        notify.onError({
          title: 'build:tsc',
          message: `Error Code: ${code}`
        })(new Error(`Error Code: ${code}`));
        cb(code)
      }
    })
})

function buildRollup(minify, cb) {
  const resolve = require('rollup-plugin-node-resolve')
  const commonjs = require('rollup-plugin-commonjs')
  const sourcemaps = require('rollup-plugin-sourcemaps')
  const terser = require('rollup-plugin-terser')
  return rollup.rollup({
    input: path.join(dstDir, 'src', 'index.js'),
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') {return}
      warn(warning);
    },
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/mithril/index.js': [ 'mithril' ]
        }
      }),
      sourcemaps(),
      minify ? terser.terser() : null,
    ].filter((it) => !!it),
  })
  .then((bundle) => {
    return bundle.write({
      format: 'umd',
      sourcemap: true,
      file: path.join(dstDir, minify ? 'qui.umd.min.js' : 'qui.umd.js'),
      name: 'qui',
      exports: 'named',
    })
  })
  .then(() => {
    cb()
  })
  .catch((err) => {
    cb(err)
  })
}

gulp.task('build:rollup:dev', ['build:tsc'], (cb) => {
  buildRollup(false, cb)
})
gulp.task('build:rollup:min', ['build:tsc'], (cb) => {
  buildRollup(true, cb)
})
gulp.task('build:rollup', ['build:rollup:min', 'build:rollup:dev'])

gulp.task('build:style', () => {
  return gulp.src([
    path.join(srcDir, 'style', 'qui*.scss'),
  ])
  .pipe(sourcemaps.init())
  .pipe(sass({
    includePaths: path.join(srcDir, 'style'),
    outputStyle: 'compressed',
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(path.join(dstDir)))
})

gulp.task('watch', ['clean'], () => {
  gulp.watch(path.join(srcDir, '**', '*.ts'), ['build:rollup', 'build:rollup:min'])
  gulp.watch(path.join(srcDir, '**', '*.scss'), ['build:style'])
  gulp.start('build:rollup', 'build:style')
})

gulp.task('publish', ['clean'], () => {
  gulp.start('build:rollup', 'build:style', () => {
    shell.exec(`npm publish --access=public`)
  })
})

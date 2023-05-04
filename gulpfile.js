import gulp from 'gulp';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssScss from 'postcss-scss';
import autoprefixer from 'autoprefixer';
import postcssCsso from 'postcss-csso'
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import sass from 'gulp-dart-sass';
import svgmin from 'gulp-svgmin';
import terser from 'gulp-terser';
import libsquoosh from 'gulp-libsquoosh';
import { stacksvg } from 'gulp-stacksvg';

const style = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(postcss([
      postcssImport(),
      postcssUrl()
    ], {
      syntax: postcssScss
    }))
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'SCSS',
          message: 'Error: <%= error.message %>',
          sound: true
        }
      })
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(groupCssMediaQueries())
    .pipe(postcss([
      autoprefixer(),
      postcssCsso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('docs/css', { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream())
}

const script = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('docs/js'))
    .pipe(browserSync.stream())
}

const image = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(libsquoosh())
    .pipe(gulp.dest('docs/img'))
}

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/svg'])
    .pipe(svgmin())
    .pipe(gulp.dest('docs/img'))
}

const sprite = () => {
  return gulp.src('source/img/svg/*.svg')
    .pipe(stacksvg({ output: 'sprite' }))
    .pipe(gulp.dest('docs/img'))
}

const clean = () => {
  return del('docs')
}

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', style);
  gulp.watch('source/js/*.js', script)
  gulp.watch('source/*.html', html);
  gulp.watch('docs/*.html').on('change', browserSync.reload);
}

const server = (done) => {
  browserSync.init({
    server: {
      baseDir: 'docs'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
  watcher();
}

const dev = gulp.series(
  clean,
  gulp.parallel(
    html,
    style,
    script,
    image,
    svg,
    sprite
  ),
  server
)

const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    style,
    script,
    image,
    svg,
    sprite
  )
)

gulp.task('dev', dev)
gulp.task('build', build)
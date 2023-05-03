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
    .pipe(gulp.dest('dist/css', { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
}

const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/svg'])
    // .pipe(svgmin())
    .pipe(gulp.dest('dist/img'))
}

const clean = () => {
  return del('dist')
}

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(style));
  gulp.watch('source/*.html', gulp.series(html));
  gulp.watch('dist/*.html').on('change', browserSync.reload);
}

const server = (done) => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
  watcher();
}

const start = gulp.series(
  clean,
  gulp.parallel(
    html,
    style,
    svg
  ),
  server
)

const dev = gulp.series(
  clean,
  gulp.parallel(
    html,
    style,
    svg
  )
)

gulp.task('start', start)
gulp.task('dev', dev)
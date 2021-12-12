const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf')
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// Static server
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 8000,
      baseDir: "build"
    }
  });

  gulp.watch("build/**/*").on('change', browserSync.reload);
});

// Pug compile
gulp.task('templates:compile', function buildHTML(){
  return gulp.src('source/template/index.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('build'))
})


/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
});


// Sprites
gulp.task('sprite', function (cd) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.css'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cd()
});


//Delete
gulp.task('clean', function del(cd){
  return rimraf('build', cd);
})


// Copy Fonts
gulp.task('copy:fonts', function(){
  return gulp.src('./source/fonts/**/*.*')
      .pipe(gulp.dest('build/fonts'));
});

// Copy Images
gulp.task('copy:images', function(){
  return gulp.src('./source/images/**/*.*')
      .pipe(gulp.dest('build/images'));
});

//Copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});


gulp.task('default', gulp.series(
        'clean',
        gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
        gulp.parallel('watch', 'server')
    )
);



// Autoprefixer Task

gulp.task('autoprefixer', function(){
  gulp.src('source/styles/main.scss')
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('build/css/'));
});
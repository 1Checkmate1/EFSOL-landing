const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');


gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload)
});



gulp.task('template:compile', buildHTML => {
    return gulp.src('src/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
})

gulp.task('sass', () => {
    return gulp.src('src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'))
})

gulp.task('sprite', function(cb) {
    const spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('src/style/global/'));
    cb();
});


gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});


gulp.task('copy:font', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('build/font'));
});

gulp.task('copy:img', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

gulp.task('copy', gulp.parallel('copy:font', 'copy:img'));

gulp.task ('autoprefixer', () => (
        gulp.src('./build/css/main.css')
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('build/css'))
    )
);

gulp.task('watch', function() {
    gulp.watch('src/template/**/*.pug', gulp.series('template:compile'));
    gulp.watch('src/style/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('template:compile', 'sass', 'sprite', 'copy'),
    gulp.task('autoprefixer'),
    gulp.parallel('watch', 'server')
))
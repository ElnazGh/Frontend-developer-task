const gulp = require('gulp');
//const bundle = require('gulp-bundle-assets');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const wait = require('gulp-wait');

//const scripts = require('./scripts');
//const jsDest = './public/';

//style paths
const sassFiles = './assets/css/**/*.scss';
const cssDest = './public/';

var devMode = false;

gulp.task('css', function () {
    return gulp.src(sassFiles)
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(cssDest));
});

// gulp.task('js', function() {
//     gulp.src([
//         './node_modules/jquery/dist/jquery.min.js',
//         './node_modules/angular/angular.min.js',
//         './node_modules/angular-route/angular-route.min.js',
//         './node_modules/angular-cookies/angular-cookies.min.js',
//         './node_modules/angular-smart-table/dist/smart-table.min.js',
//         './src/**/*.js',
//         './src/result/*.json',
//         './src/assets/js/*.js'
//         ])
//         .pipe(concat('app.js'))
//         .pipe(gulp.dest(jsDest))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

// gulp.task('js', function() {
//   return gulp.src('./bundle.config.js')
//     .pipe(bundle())
//     .pipe(gulp.dest('./public'));
// });

// gulp.task('html', function() {
//     return gulp.src('./src/**/*.html')
//         .pipe(gulp.dest('./public/'))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

// gulp.task('img', function() {
//     return gulp.src('./src/assets/images/**/*')
//         .pipe(gulp.dest('./dist/assets/images'))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

gulp.task('build', function() {
    gulp.start(['css']); //, 'js', 'html', 'img'
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        open: false,
        server: {
            baseDir: 'public',
        }
    });
});

gulp.task('start', function() {
    devMode = true;
    gulp.start(['build', 'browser-sync']);
    gulp.watch([sassFiles], ['css']);
    // gulp.watch(['./src/**/*.js'], ['js']);
    // gulp.watch(['./src/**/*.html'], ['html']);
    // gulp.watch(['./src/assets/images/**/*'], ['img']);
});

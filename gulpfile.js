// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var paths = {
    src : {
        sass: 'assets/scss/*.scss',
        scripts: ['assets/scripts/*.js', '!assets/scripts/*.min.js'],
        unitegallery: 'assets/unitegallery/**/*.*'
    },
    dest: {
        root: 'public',
        jsmin: 'all.min.js',
        sass: 'public/css',
        scripts: 'public/js',
        unitegallery: 'public/unitegallery'
    }
};

// Lint Task
// gulp.task('lint', function() {
//     return gulp.src(paths.src.scripts)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(paths.src.sass)
        .pipe(sass())
        .pipe(gulp.dest(paths.dest.sass));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(paths.src.scripts)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.dest.root))
        .pipe(rename(paths.dest.jsmin))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest.scripts));
});

// Unitegallery
gulp.task('unitegallery',function(){
    return gulp.src([paths.src.unitegallery]) 
    .pipe(gulp.dest(paths.dest.unitegallery));
  });

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch(paths.src.scripts, ['lint', 'scripts']);
    gulp.watch(paths.src.sass, ['sass']);
});

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['sass', 'scripts', 'unitegallery', 'watch']);
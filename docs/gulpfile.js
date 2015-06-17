var autoprefixer = require('gulp-autoprefixer');
var doxray = require('../index.js');
var gulp =   require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass =   require('gulp-ruby-sass');
var uglify = require('gulp-uglify');
var watch =  require('gulp-watch');

gulp.task('default', ['dox-ray']);

gulp.task('watch', function() {
    var sassWatcher = gulp.watch(['styles/*.scss'], ['sass', 'dox-ray']);
    sassWatcher.on('change', logChange);
});

gulp.task('sass', function() {
    var options = {
        loadPath: 'styles',
        style: 'expanded'
    };
    return sass('.', options)
    .on('error', function (err) { console.log(err.message); })
    // .pipe(autoprefixer({
    //  browsers: ['last 2 versions'],
    //  cascade: false
    // }))
    .pipe(gulp.dest(function(file) {
        return file.base;
    }));
});

gulp.task('dox-ray', ['sass'], function() {
    doxray(['styles/_variables.scss', 'styles/styles.scss'], {
        jsFile: 'parsed_docs.js',
        logging: true
    });
});

function logChange(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

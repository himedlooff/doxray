var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var doxray = require('../index.js');
var gulp =   require('gulp');
var less =   require('gulp-less');
var path =   require('path');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch =  require('gulp-watch');

gulp.task('default', ['dox-ray']);

gulp.task('watch', function() {
    var lessWatcher = gulp.watch(['styles/*.less'], ['less', 'dox-ray']);
    lessWatcher.on('change', logChange);
});

gulp.task('less', function() {
    return gulp.src('styles/doxray.less')
    .pipe(less({
        paths: [ path.join(__dirname, 'styles') ]
    }))
    .on('error', function (err) { console.log(err.message); })
    // .pipe(autoprefixer({
    //  browsers: ['last 2 versions'],
    //  cascade: false
    // }))
    .pipe(gulp.dest(function(file) {
        return file.base;
    }));
});

gulp.task('dox-ray', ['less'], function() {
    doxray([
            'styles/doxray.less',
            'styles/doxray-variables.less',
            'styles/doxray-docs.less'
        ], {
        jsFile: 'parsed_docs.js',
        logging: true
    });
});

function logChange(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

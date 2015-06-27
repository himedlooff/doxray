var autoprefixer = require('gulp-autoprefixer');
var doxray = require('../index.js');
var gulp =   require('gulp');
var less =   require('gulp-less');
var path =   require('path');
var watch =  require('gulp-watch');

gulp.task('default', ['dox-ray']);

gulp.task('watch', function() {
    gulp.watch(['styles/*.less'], ['less', 'dox-ray']);
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
        jsFile: 'doxray-parsed-data.js',
        logging: true
    });
});

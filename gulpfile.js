var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var browserSync = require('browser-sync');
var fs = require('fs');
var foldero = require('foldero');
var dataPath = 'jade/_data/';

//  browserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build/'
    }
  });
});

// jade
gulp.task('jade', function() {
  var siteData = {};
  if (fs.existsSync(dataPath)) {
    siteData = foldero(dataPath, {
      recurse: true,
      whitelist: '(.*/)*.+\.(json)$',
      loader: function loadAsString(file) {
        var json = {};
        try {
          json = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (e) {
          console.log('Error Parsing JSON file: ' + file);
          console.log('==== Details Below ====');
          console.log(e);
        }
        return json;
      }
    });
  }

  return gulp.src('jade/_pages/*.jade')
    .pipe(plumber({
      errorHandler: notify.onError('Error:  <%= error.message %>')
    }))
    .pipe(jade({
      locals: {
        site: {
          data: siteData
        }
      },
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(notify({
      message: 'jade up!',
      sound: 'Pop'
    }));
});

// default
gulp.task('default', ['jade', 'browserSync'], function() {
  gulp.watch('jade/*/*', ['jade', browserSync.reload]);
});

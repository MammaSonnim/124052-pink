var gulp = require('gulp'),
  plumb = require('gulp-plumber'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  jade = require('gulp-jade'),
  sync = require("browser-sync"),
  fs = require('fs'),
  foldero = require('foldero'),
  dataPath = './src/jade/_data/';

//  browserSync
gulp.task('sync', function() {
  sync.init({
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

  return gulp.src('src/jade/_pages/*.jade')
    .pipe(jade({
      locals: {
        site: {
          data: siteData
        }
      },
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
});

// default
gulp.task('default', ['jade', 'sync'], function() {
  gulp.watch('src/jade/*/*', ['jade', sync.reload]);
});

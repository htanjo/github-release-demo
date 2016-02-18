'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var config = require('config');
var GitHubApi = require('github4');
var pify = require('pify');
var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var github = new GitHubApi();
github.authenticate(config.auth);

gulp.task('release', function () {
  return pify(github.repos.createRelease)({
      user: 'htanjo',
      repo: 'github-release-demo',
      tag_name: 'v' + pkg.version,
      body: 'Release v' + pkg.version
    })
    .then(function (res) {
      gutil.log('Release "' + res.tag_name + '" created');
      return res.id;
    })
    .then(function (id) {
      return pify(github.repos.uploadAsset)({
        user: 'htanjo',
        repo: 'github-release-demo',
        id: id,
        name: pkg.name + '-v' + pkg.version + '.zip',
        filePath: 'dist/' + pkg.name + '.zip'
      })
    })
    .then(function (res) {
      gutil.log('Asset "' + res.name + '" uploaded');
    });
});

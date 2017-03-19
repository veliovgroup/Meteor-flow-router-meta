Package.describe({
  name: 'ostrio:flow-router-meta',
  version: '2.0.3',
  summary: 'Change meta tags, links to styles (CSS) and scripts on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-meta',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');
  api.use(['underscore', 'ecmascript', 'ostrio:flow-router-title@3.0.0', 'ostrio:flow-router-extra@3.0.0'], 'client');
  api.mainModule('flow-router-meta.js', 'client');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript', 'ostrio:flow-router-extra', 'ostrio:flow-router-meta', 'random'], 'client');
  api.addFiles('tests.js', 'client');
});

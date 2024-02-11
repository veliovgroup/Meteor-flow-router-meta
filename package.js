Package.describe({
  name: 'ostrio:flow-router-meta',
  version: '2.2.0',
  summary: 'Change meta tags, links to styles (CSS) and scripts on the fly via flow-router definition',
  git: 'https://github.com/veliovgroup/Meteor-flow-router-meta',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '3.0-beta.0']);
  api.use(['ecmascript', 'ostrio:flow-router-title@3.3.0'], 'client');
  api.mainModule('flow-router-meta.js', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'jquery', 'random', 'ostrio:flow-router-extra@3.10.0', 'ostrio:flow-router-title@3.3.0'], 'client');
  api.addFiles('tests.js', 'client');
});

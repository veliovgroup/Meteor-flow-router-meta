Package.describe({
  name: 'ostrio:flow-router-meta',
  version: '2.1.2',
  summary: 'Change meta tags, links to styles (CSS) and scripts on the fly via flow-router definition',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-meta',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.4');
  api.use(['ecmascript', 'ostrio:flow-router-title@3.2.2'], 'client');
  api.mainModule('flow-router-meta.js', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'jquery', 'random', 'ostrio:flow-router-extra@3.8.0', 'ostrio:flow-router-title@3.2.2'], 'client');
  api.addFiles('tests.js', 'client');
});

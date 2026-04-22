Package.describe({
  name: 'ostrio:flow-router-meta',
  version: '2.4.3',
  summary: 'Set and update meta, link, and script tags via flow-router hooks',
  git: 'https://github.com/veliovgroup/Meteor-flow-router-meta',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '2.8.0', '3.0.1', '3.4']);
  api.use(['ecmascript', 'ostrio:flow-router-title@3.5.2'], 'client');
  api.use(['zodern:types@1.0.13', 'typescript'], 'client', { weak: true });
  api.mainModule('flow-router-meta.js', 'client');
  api.addAssets('index.d.ts', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'jquery', 'random', 'ostrio:flow-router-extra@3.14.0', 'ostrio:flow-router-title@3.5.2'], 'client');
  api.addFiles('tests.js', 'client');
});

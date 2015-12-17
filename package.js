Package.describe({
  name: 'ostrio:flow-router-meta',
  version: '1.0.0',
  summary: 'Change meta tags, links to styles (CSS) and scripts on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-meta',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['underscore', 'coffeescript', 'reactive-var', 'ostrio:flow-router-extra@2.10.1'], 'client');
  api.addFiles('flow-router-meta.coffee', 'client');
  api.export('FlowRouterMeta', 'client');
  api.imply('ostrio:flow-router-title@2.0.1', 'client');
});
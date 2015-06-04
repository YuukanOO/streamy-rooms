Package.describe({
  name: 'yuukan:streamy-rooms',
  version: '1.2.0',
  // Brief, one-line summary of the package.
  summary: 'Add rooms support to streamy',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/YuukanOO/streamy-rooms',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  
  api.use([
    'underscore',
    'mongo',
    'yuukan:streamy@1.2.0'
  ]);
  
  // Both
  api.addFiles([
    'lib/namespaces.js',
    'lib/rooms.js'
  ]);
  
  // Client only
  api.addFiles([
    'lib/rooms_client.js'
  ], 'client');
  
  // Server only
  api.addFiles([
    'lib/rooms_server.js'
  ], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('yuukan:streamy-rooms');
});

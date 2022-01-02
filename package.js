Package.describe({
  name: 'nschwarz:meteor-scssr',
  version: '0.0.1',
  summary:
    'css / scss meteor package with critical styling rendering on the server',
  git: 'https://github.com/nathanschwarz/meteor-cluster.git',
  documentation: 'README.md',
})

Package.onUse(api => {
  api.versionsFrom('1.9')
  api.use('ecmascript')
  api.use('isobuild:compiler-plugin@1.0.0')
  //api.addFiles(['src/ServerStylesheet.js'], 'server')
})

Npm.depends({
  sass: '1.45.0',
})

Package.registerBuildPlugin({
  name: 'scssCompiler',
  use: ['caching-compiler', 'ecmascript'],
  sources: ['src/compile-scss.js'],
  npmDependencies: {
    sass: '1.45.0',
  },
})

// Package.onTest(api => {
//   api.use('nschwarz:cluster')
//   api.use(['ecmascript'])
//   api.mainModule('src/tests/_index.js')
// })

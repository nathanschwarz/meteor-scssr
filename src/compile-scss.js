import sass from 'sass'

class SassCompiler extends MultiFileCachingCompiler {
  constructor() {
    super({
      compilerName: 'scssCompiler',
      defaultCacheSize: 1024 * 1024 * 10,
    })
  }
  processFilesForTarget(files) {
    files.forEach(file => {
      console.log(file)
      // TODO
    })
  }
}

Plugin.registerCompiler(
  {
    extensions: ['scss', 'sass'],
    archMatching: 'web',
  },
  () => new SassCompiler()
)

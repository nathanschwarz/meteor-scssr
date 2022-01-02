import sass from 'sass'
const fs = Plugin.fs

const ROOT_URL = process.env.PWD || process.cwd()

class SassCompiler {
  constructor() {
    this.sassImporter = [
      {
        canonicalize(url) {
          let _url = url
          let toReplace = null
          if (url.startsWith('{}')) {
            _url = _url.replace('{}', '')
          } else if (url.startsWith('%7B%7D')) {
            _url = _url.replace('%7B%7D', '')
          } else if (url.startsWith('@package')) {
            console.error('PACKAGE IMPORT IS NOT SUPPORTED YET')
          }
          if (!_url.startsWith('/')) {
            _url = '/node_modules/' + _url
          }
          _url = Plugin.convertToOSPath(ROOT_URL + _url)
          return new URL(_url, 'file://')
        },
        load(canonicalUrl) {
          try {
            return fs.readFileSync(canonicalUrl)
          } catch (e) {
            console.error(`cannot load ${canonicalUrl}`)
          }
        },
      },
    ]
  }
  processFile(file, arch) {
    const scssContent = file.getContentsAsString()
    try {
      return sass.compileString(scssContent, {
        importers: this.sassImporter,
      })
    } catch (e) {
      console.error(e)
      console.error(`\n[${arch}]: ${file.getDisplayPath()} wasn't compiled\n`)
      return undefined
    }
  }
  processFileForWeb(file) {
    const result = this.processFile(file, 'web')
    if (result) {
      file.addStylesheet({
        data: result.css,
        path: `${file.getPathInPackage()}.css`,
        sourceMap: null,
      })
    }
  }
  processFileForOs(file) {
    const result = this.processFile(file, 'os')
    if (result) {
      const path = file.getPathInPackage()
      const css = JSON.stringify(result.css)
      file.addJavaScript({
        data: `exports.css=${css}`,
        path: path.replace('.scss', '_scss.js'),
      })
    }
  }
  processFilesForTarget(files) {
    files.forEach(file => {
      const arch = file.getArch()
      if (arch.startsWith('web')) {
        return this.processFileForWeb(file)
      }
      if (arch.startsWith('os')) {
        return this.processFileForOs(file)
      }
    })
  }
}

Plugin.registerCompiler(
  {
    extensions: ['scss', 'sass'],
  },
  () => new SassCompiler()
)

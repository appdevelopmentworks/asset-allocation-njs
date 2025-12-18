const path = require('path')

const projectRoot = __dirname
const srcDir = path.join(projectRoot, 'src')
const ROOT_MARKERS = [
  '/lib/',
  '/components/',
  '/hooks/',
  '/types/',
  '/utils/',
  '/stores/',
  '/api/',
  '/app/',
  '/tests/',
]

module.exports = function jestResolver(request, options) {
  const defaultResolver = options?.defaultResolver
  const invokeDefault = (nextRequest) => {
    if (typeof defaultResolver === 'function') {
      return defaultResolver(nextRequest, { ...options, defaultResolver: undefined })
    }
    return nextRequest
  }

  const basedir = options?.basedir ?? ''
  if (basedir.includes(`node_modules${path.sep}`)) {
    return invokeDefault(request)
  }

  if (request.startsWith('@/')) {
    const absolutePath = path.join(srcDir, request.slice(2))
    return invokeDefault(absolutePath)
  }

  if (request.startsWith('../')) {
    const normalized = request.replace(/\\/g, '/')
    for (const marker of ROOT_MARKERS) {
      const markerPattern = `.${marker}`
      const index = normalized.indexOf(markerPattern)
      if (index !== -1) {
        const suffix = normalized.slice(index + 2)
        const absolutePath = path.join(srcDir, suffix)
        return invokeDefault(absolutePath)
      }
    }
  }

  return invokeDefault(request)
}

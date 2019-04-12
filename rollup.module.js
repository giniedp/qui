'use strict'

import config from './rollup.base'

const plugins = []
config.plugins.forEach((it) => {
  if (it.name !== 'commonjs') {
    plugins.push(it)
  }
})

export default Object.assign({}, config, {
  external: ['mithril'],
  output: {
    name: 'qui',
    file: 'dist/qui.module.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: plugins,
})

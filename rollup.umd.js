import config from './rollup.base'

export default Object.assign({}, config, {
  output: {
    name: 'qui',
    file: 'dist/qui.umd.js',
    format: 'umd',
    sourcemap: true,
  }
})

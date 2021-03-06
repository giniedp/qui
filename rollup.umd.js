import config from './rollup.base'

export default Object.assign({}, config, {
  output: {
    name: 'TweakUi',
    file: 'dist/tweak-ui.umd.js',
    format: 'umd',
    sourcemap: true,
  }
})

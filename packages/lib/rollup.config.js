import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  output: {
    exports: 'named',
    name: pkg.name,
    file: `dist/index.${process.env.FORMAT}.js`,
    format: process.env.FORMAT,
    sourcemap: false,
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      fastdom: 'fastdom',
      'fastdom/extensions/fastdom-promised': 'fastdomPromised',
    },
  },
  plugins: [
    sourcemaps(),
    babel(),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx'],
    }),
    terser(),
  ],
  external: [
    'react',
    'prop-types',
    'fastdom',
    'fastdom/extensions/fastdom-promised',
  ],
}

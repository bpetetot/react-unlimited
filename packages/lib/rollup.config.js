import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { terser } from "rollup-plugin-terser";

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  output: {
    name: pkg.name,
    file: `build/index.${process.env.FORMAT}.js`,
    format: process.env.FORMAT,
    sourcemap: false,
    globals: {
      react: 'React',
      classnames: 'cn',
      'prop-types': 'PropTypes',
      'lodash/range': 'range',
    }
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
    'lodash/range',
    'classnames',
  ],
}

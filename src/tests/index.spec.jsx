import {transformFileSync} from 'babel-core'
import path from 'path'

import plugin from '../'

describe('test babel plugin', () => {
  it('simple test with import', () => {
    const expected = require('./App/expected.import').default

    const {code} = transformFileSync(path.join(__dirname, './App/index.import.jsx'), {
      babelrc: false,
      plugins: ['syntax-jsx', [plugin]],
    })

    expect(code).toEqual(expected)
  })

  it('simple test with require', () => {
    const expected = require('./App/expected.require').default

    const {code} = transformFileSync(path.join(__dirname, './App/index.require.jsx'), {
      babelrc: false,
      plugins: ['syntax-jsx', [plugin]],
    })

    expect(code).toEqual(expected)
  })
})

import {transformFileSync} from 'babel-core'
import path from 'path'

import expected from './App/expected'

import plugin from '../'

describe('test babel plugin', () => {
  it('simple test', () => {
    const transformed = transformFileSync(path.join(__dirname, './App/index.jsx'), {
      babelrc: false,
      plugins: ['syntax-jsx', [plugin]],
    }).code

    expect(transformed).toEqual(expected)
  })
})

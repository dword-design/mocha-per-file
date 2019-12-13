import { spawn } from 'child-process-promise'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'
import { endent } from '@dword-design/functions'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/a/foo.test.js', endent`
    const expect = require('expect')

    module.exports = () => expect(1).toEqual(2)
  `)
  let stdout
  try {
    await spawn('mocha-per-file', [], { capture: ['stdout'] })
  } catch (error) {
    stdout = error.stdout
  }
  expect(stdout).toMatch(/^\n\n  a\n    1\) foo\n\n\n  0 passing \(.*?\)\n  1 failing\n\n  1\) a\n       foo:\n     Error: expect\(received\)\.toEqual\(expected\) \/\/ deep equality\n\nExpected: 2\nReceived: 1/)
})

export const timeout = 5000

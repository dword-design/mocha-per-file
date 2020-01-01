import { spawn } from 'child-process-promise'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'
import { endent } from '@dword-design/functions'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/foo.test.js', endent`
    module.exports = {
      timeout: 100,
      it: done => setTimeout(done, 200),
    }
  `)
  let stdout
  try {
    await spawn('mocha-per-file', [], { capture: ['stdout'] })
  } catch (error) {
    stdout = error.stdout
  }
  expect(stdout).toMatch('Error: Timeout of 100ms exceeded.')
})
export const timeout = 5000

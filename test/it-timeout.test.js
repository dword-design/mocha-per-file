import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import resolveBin from 'resolve-bin'
import { outputFile } from 'fs'
import { endent } from '@functions'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/foo.test.js', endent`
    module.exports = {
      timeout: 3000,
      it: done => setTimeout(done, 2100),
    }
  `)
  const { stdout } = await spawn(resolveBin.sync('mocha-per-file'), [], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  ✓ foo.*?\n\n  1 passing \(.*?\)\n\n$/)
})
export const timeout = 5000

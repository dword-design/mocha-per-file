import { spawn } from 'child-process-promise'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/foo.test.js', 'module.exports = () => {}')
  const { stdout } = await spawn('mocha-per-file', ['--reporter', 'json'], { capture: ['stdout'] })
  expect(JSON.parse(stdout).tests[0].title).toEqual('foo')
})

export const timeout = 5000

import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/foo.test.js', 'module.exports = () => new Promise(resolve => setTimeout(resolve, 500))')
  let stdout
  try {
    await spawn('mocha-per-file', ['--timeout', 100], { capture: ['stdout'] })
  } catch (error) {
    stdout = error.stdout
  }
  expect(stdout).toMatch('Error: Timeout of 100ms exceeded.')
})

export const timeout = 5000

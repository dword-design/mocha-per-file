import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/a/foo.test.js', 'module.exports = () => console.log(process.cwd())')
  const { stdout } = await spawn('mocha-per-file', ['--chdir'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n.*?\/test\/a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})

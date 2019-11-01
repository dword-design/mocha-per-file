const { spawn } = require('child-process-promise')
const expect = require('expect')
const chdir = require('chdir')

it('cwd', () => chdir(__dirname, async () => {
  const { stdout } = await spawn('mocha-per-file', ['--chdir'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n.*?cwd\/test\/a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})).timeout(5000)

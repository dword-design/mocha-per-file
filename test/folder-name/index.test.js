const { spawn } = require('child-process-promise')
const expect = require('expect')
const chdir = require('chdir')

it('folder name', () => chdir(__dirname, async () => {
  const { stdout } = await spawn('mocha-per-file', ['test2'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})).timeout(5000)

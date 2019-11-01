const { spawn } = require('child-process-promise')
const expect = require('expect')
const chdir = require('chdir')

it('args', () => chdir(__dirname, async () => {
  const { stdout } = await spawn('mocha-per-file', ['--require', 'setup.js'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^test\n\n\n  ✓ foo.*?\n\n  1 passing \(.*?\)\n\n$/)
})).timeout(5000)

const { spawn } = require('child-process-promise')
const expect = require('expect')
const chdir = require('chdir')

it('it-timeout', () => chdir(__dirname, async () => {
  const { stdout } = await spawn('mocha-per-file', [], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  ✓ foo.*?\n\n  1 passing \(.*?\)\n\n$/)
})).timeout(5000)

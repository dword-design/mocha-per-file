const { spawn } = require('child-process-promise')
const expect = require('expect')
const chdir = require('chdir')

it('works', () => chdir(__dirname, async () => {
  const { stdout } = await spawn('mocha-per-file', [], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ bar\n    ✓ foo\n\n  b\n    ✓ baz\n\n\n  3 passing \(.*?\)\n\n$/)
})).timeout(5000)

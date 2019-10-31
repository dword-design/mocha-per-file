const { spawn } = require('child-process-promise')
const expect = require('expect')

it('works',  async () => {
  const { stdout } = await spawn('mocha-per-file', [], { cwd: __dirname, capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ bar\n    ✓ foo\n\n  b\n    ✓ baz\n\n\n  3 passing \(.*?\)\n\n$/)
}).timeout(5000)

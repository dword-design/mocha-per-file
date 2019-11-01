const { spawn } = require('child-process-promise')
const expect = require('expect')

it('only',  async () => {
  const { stdout } = await spawn('mocha-per-file', [], { cwd: __dirname, capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  ✓ foo\n\n  1 passing \(.*?\)\n\n$/)
}).timeout(5000)

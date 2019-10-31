const { spawn } = require('child-process-promise')
const expect = require('expect')

it('done',  async () => {
  const { stdout } = await spawn('mocha-per-file', [], { cwd: __dirname, capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ foo (.*?)\n\n\n  1 passing (.*?)\n\n$/)
}).timeout(5000)

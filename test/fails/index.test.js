const { spawn } = require('child-process-promise')
const expect = require('expect')

it('fails', done => {
  spawn('mocha-per-file', [], { capture: ['stdout'], cwd: __dirname })
    .catch(({ stdout }) => {
      expect(stdout).toMatch(/^\n\n  a\n    1\) foo\n\n\n  0 passing \(.*?\)\n  1 failing\n\n  1\) a\n       foo:\n     Error: expect\(received\)\.toEqual\(expected\) \/\/ deep equality\n\nExpected: 2\nReceived: 1\n      at Context\.module\.exports \(test\/a\/foo\.test\.js:3:34\)\n\n\n\n$/)
      done()
    })
}).timeout(5000)

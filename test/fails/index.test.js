const { spawn } = require('child-process-promise')
const expect = require('expect')
const chdir = require('chdir')

it('fails', done => {
  chdir(__dirname,
    () => spawn('mocha-per-file', [], { capture: ['stdout'] })
      .catch(({ stdout }) => {
        expect(stdout).toMatch(/^\n\n  a\n    1\) foo\n\n\n  0 passing \(.*?\)\n  1 failing\n\n  1\) a\n       foo:\n     Error: expect\(received\)\.toEqual\(expected\) \/\/ deep equality\n\nExpected: 2\nReceived: 1/)
        done()
      })
  )
}).timeout(5000)

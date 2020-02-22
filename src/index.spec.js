import execa from 'execa'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'
import { endent } from '@dword-design/functions'
import outputFiles from 'output-files'
import escape from 'escape-string-regexp'
import P from 'path'

export default {
  chdir: () => withLocalTmpDir(async () => {
    await outputFile('test/a/foo.test.js', 'module.exports = () => console.log(process.cwd())')
    const { all } = await execa.command('mocha-per-file --chdir', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
      ${escape(P.resolve('test', 'a'))}
          . foo( \\(.*?\\))?
      
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  done: () => withLocalTmpDir(async () => {
    await outputFile('test/a/foo.test.js', 'module.exports = done => setTimeout(done, 100)')
    const { all } = await execa.command('mocha-per-file', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          . foo( \\(.*?\\))?
      
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  fails: () => withLocalTmpDir(async () => {
    await outputFile('test/a/foo.test.js', endent`
      const expect = require('expect')

      module.exports = () => expect(1).toEqual(2)
    `)
    let all
    try {
      await execa.command('mocha-per-file', { all: true })
    } catch (error) {
      all = error.all
    }
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          1\\) foo
      
      
        0 passing \\(.*?\\)
        1 failing

        1\\) a
             foo:
           Error: expect\\(received\\)\\.toEqual\\(expected\\) // deep equality
      
      Expected: 2
      Received: 1
    `))
  }),
  'it timeout': () => withLocalTmpDir(async () => {
    await outputFile('test/foo.test.js', endent`
      module.exports = {
        timeout: 100,
        it: done => setTimeout(done, 200),
      }
    `)
    let all
    try {
      await execa.command('mocha-per-file', { all: true })
    } catch (error) {
      all = error.all
    }
    expect(all).toMatch('Error: Timeout of 100ms exceeded.')
  }),
  only: () => withLocalTmpDir(async () => {
    await outputFiles({
      test: {
        'bar.test.js': 'module.exports = () => {}',
        'foo.test.js': endent`
          module.exports = {
            only: true,
            it: () => {},
          }
        `,
      },
    })
    const { all } = await execa.command('mocha-per-file', { all: true })
    expect(all).toMatch(/^\n\n  . foo\n\n  1 passing \(.*?\)\n$/)
  }),
  path: () => withLocalTmpDir(async () => {
    await outputFile('test2/a/foo.test.js', 'module.exports = () => {}')
    const { all } = await execa.command('mocha-per-file --path test2', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          . foo( \\(.*?\\))?
      
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  'pattern: with path': () => withLocalTmpDir(async () => {
    await outputFiles({
      'test2/a': {
        'foo.test.js': 'module.exports = () => {}',
        'bar.test.js': 'module.exports = () => {}',
      },
    })
    const { all } = await execa.command('mocha-per-file --path test2 a/foo.test.js', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          . foo( \\(.*?\\))?
      
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  'pattern: same folder': () => withLocalTmpDir(async () => {
    await outputFiles({
      'test/a': {
        'foo.test.js': 'module.exports = () => {}',
        'bar.test.js': 'module.exports = () => {}',
      },
    })
    const { all } = await execa.command('mocha-per-file a/foo.test.js', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          . foo( \\(.*?\\))?
      
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  'pattern: different folder': () => withLocalTmpDir(async () => {
    await outputFiles({
      test: {
        a: {
          'foo.test.js': 'module.exports = () => {}',
          'bar.test.js': 'module.exports = () => {}',
        },
        'b/foo.test.js': 'module.exports = () => {}',
      },
    })
    const { all } = await execa.command('mocha-per-file a/foo.test.js', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          . foo( \\(.*?\\))?
      
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  reporter: () => withLocalTmpDir(async () => {
    await outputFile('test/foo.test.js', 'module.exports = () => {}')
    const { all } = await execa.command('mocha-per-file --reporter json', { all: true })
    expect(JSON.parse(all).tests[0].title).toEqual('foo')
  }),
  require: () => withLocalTmpDir(async () => {
    await outputFiles({
      'test/foo.test.js': 'module.exports = () => {}',
      'setup.js': 'console.log(\'test\')',
    })
    const { all } = await execa.command('mocha-per-file --require setup.js', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^test
      
      
        . foo( \\(.*?\\))?
      
        1 passing \\(.*?\\)
      $
    `))
  }),
  timeout: () => withLocalTmpDir(async () => {
    await outputFile('test/foo.test.js', 'module.exports = () => new Promise(resolve => setTimeout(resolve, 200))')
    let all
    try {
      await execa.command('mocha-per-file --timeout 100', { all: true })
    } catch (error) {
      all = error.all
    }
    expect(all).toMatch('Error: Timeout of 100ms exceeded.')
  }),
  valid: () => withLocalTmpDir(async () => {
    await outputFiles({
      test: {
        a: {
          'bar.test.js': 'module.exports = () => {}',
          'foo.test.js': endent`
            const expect = require('expect')

            module.exports = () => expect(process.cwd().endsWith('/test/works/test/a')).toBeFalsy()
          `,
        },
        'b/baz.test.js': 'module.exports = () => {}',
      },
    })
    const { all } = await execa.command('mocha-per-file', { all: true })
    expect(all).toMatch(new RegExp(endent`
      ^
      
        a
          . bar( \\(.*?\\))?
          . foo( \\(.*?\\))?
      
        b
          . baz( \\(.*?\\))?
      
      
        3 passing \\(.*?\\)
      $
    `))
  }),
}

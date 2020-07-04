import { endent } from '@dword-design/functions'
import escape from 'escape-string-regexp'
import execa from 'execa'
import { outputFile } from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  chdir: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'test/a/foo.test.js',
        'module.exports = () => console.log(process.cwd())'
      )
      const output = await execa(require.resolve('./cli'), ['--chdir'], {
        all: true,
      })
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
      ${escape(P.resolve('test', 'a'))}
          . foo( \\(.*?\\))?


        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  done: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'test/a/foo.test.js',
        'module.exports = done => setTimeout(done, 100)'
      )
      const output = await execa(require.resolve('./cli'), { all: true })
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
          . foo( \\(.*?\\))?


        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  fails: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'test/a/foo.test.js',
        endent`
      const expect = require('expect')

      module.exports = () => expect(1).toEqual(2)
    `
      )
      let all
      try {
        await execa(require.resolve('./cli'), { all: true })
      } catch (error) {
        all = error.all
      }
      expect(all).toMatch(
        new RegExp(endent`
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
    `)
      )
    }),
  'it timeout': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'test/foo.test.js',
        endent`
      module.exports = {
        timeout: 100,
        it: done => setTimeout(done, 200),
      }
    `
      )
      let all
      try {
        await execa(require.resolve('./cli'), { all: true })
      } catch (error) {
        all = error.all
      }
      expect(all).toMatch('Error: Timeout of 100ms exceeded.')
    }),
  only: () =>
    withLocalTmpDir(async () => {
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
      const output = await execa(require.resolve('./cli'), { all: true })
      expect(output.all).toMatch(/^\n\n  . foo\n\n  1 passing \(.*?\)\n$/)
    }),
  path: () =>
    withLocalTmpDir(async () => {
      await outputFile('test2/a/foo.test.js', 'module.exports = () => {}')
      const output = await execa(
        require.resolve('./cli'),
        ['--path', 'test2'],
        {
          all: true,
        }
      )
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
          . foo( \\(.*?\\))?


        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  'pattern: different folder': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        test: {
          a: {
            'bar.test.js': 'module.exports = () => {}',
            'foo.test.js': 'module.exports = () => {}',
          },
          'b/foo.test.js': 'module.exports = () => {}',
        },
      })
      const output = await execa(require.resolve('./cli'), ['a/foo.test.js'], {
        all: true,
      })
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
          . foo( \\(.*?\\))?


        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  'pattern: same folder': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'test/a': {
          'bar.test.js': 'module.exports = () => {}',
          'foo.test.js': 'module.exports = () => {}',
        },
      })
      const output = await execa(require.resolve('./cli'), ['a/foo.test.js'], {
        all: true,
      })
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
          . foo( \\(.*?\\))?


        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  'pattern: with path': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'test2/a': {
          'bar.test.js': 'module.exports = () => {}',
          'foo.test.js': 'module.exports = () => {}',
        },
      })
      const output = await execa(
        require.resolve('./cli'),
        ['--path', 'test2', 'a/foo.test.js'],
        {
          all: true,
        }
      )
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
          . foo( \\(.*?\\))?


        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  reporter: () =>
    withLocalTmpDir(async () => {
      await outputFile('test/foo.test.js', 'module.exports = () => {}')
      const output = await execa(
        require.resolve('./cli'),
        ['--reporter', 'json'],
        {
          all: true,
        }
      )
      expect(JSON.parse(output.all).tests[0].title).toEqual('foo')
    }),
  require: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'setup.js': "console.log('test')",
        'test/foo.test.js': 'module.exports = () => {}',
      })
      const output = await execa(
        require.resolve('./cli'),
        ['--require', 'setup.js'],
        {
          all: true,
        }
      )
      expect(output.all).toMatch(
        new RegExp(endent`
      ^test


        . foo( \\(.*?\\))?

        1 passing \\(.*?\\)
      $
    `)
      )
    }),
  timeout: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'test/foo.test.js',
        'module.exports = () => new Promise(resolve => setTimeout(resolve, 200))'
      )
      let all
      try {
        await execa(require.resolve('./cli'), ['--timeout', 100], { all: true })
      } catch (error) {
        all = error.all
      }
      expect(all).toMatch('Error: Timeout of 100ms exceeded.')
    }),
  valid: () =>
    withLocalTmpDir(async () => {
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
      const output = await execa(require.resolve('./cli'), { all: true })
      expect(output.all).toMatch(
        new RegExp(endent`
      ^

        a
          . bar( \\(.*?\\))?
          . foo( \\(.*?\\))?

        b
          . baz( \\(.*?\\))?


        3 passing \\(.*?\\)
      $
    `)
      )
    }),
}

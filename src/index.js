import execa from 'execa'
import makeCli from 'make-cli'

export default () =>
  makeCli({
    action: async (pattern = '**', options) => {
      options = { path: 'test', ...options }
      try {
        await execa(
          'mocha',
          [
            require.resolve('./test'),
            ...(options.require ? ['--require', options.require] : []),
            ...(options.timeout === undefined
              ? []
              : ['--timeout', options.timeout]),
            ...(options.reporter ? ['--reporter', options.reporter] : []),
          ],
          {
            env: {
              ...process.env,
              MOCHA_PER_FILE_IS_CHDIR: options.chdir,
              MOCHA_PER_FILE_PATH: options.path,
              MOCHA_PER_FILE_PATTERN: pattern,
            },
            stdio: 'inherit',
          }
        )
      } catch (error) {
        process.exit(1)
      }
    },
    arguments: '[pattern]',
    options: [
      {
        description: 'The path to collect tests from',
        name: '--path <path>',
      },
      {
        description: 'Change directories for each test',
        name: '-c, --chdir',
      },
      {
        description: 'Require module',
        name: '--require <module>',
      },
      {
        description: 'Timeout in milliseconds',
        name: '--timeout <ms>',
      },
      {
        description: 'Specify reporter to use',
        name: '--reporter <reporter>',
      },
    ],
  })

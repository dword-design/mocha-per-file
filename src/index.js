import execa from 'execa'
import makeCli from 'make-cli'

export default () => makeCli({
  arguments: '[pattern]',
  options: [
    {
      name: '--path <path>',
      description: 'The path to collect tests from',
    },
    {
      name: '-c, --chdir',
      description: 'Change directories for each test',
    },
    {
      name: '--require <module>',
      description: 'Require module',
    },
    {
      name: '--timeout <ms>',
      description: 'Timeout in milliseconds',
    },
    {
      name: '--reporter <reporter>',
      description: 'Specify reporter to use',
    },
  ],
  action: async (pattern = '**', { path = 'test', chdir: isChdir, require: requireModule, timeout, reporter }) => {
    try {
      await execa(
        'mocha',
        [
          require.resolve('./test'),
          ...requireModule !== undefined ? ['--require', requireModule] : [],
          ...timeout !== undefined ? ['--timeout', timeout] : [],
          ...reporter !== undefined ? ['--reporter', reporter] : [],
        ],
        {
          stdio: 'inherit',
          env: {
            ...process.env,
            MOCHA_PER_FILE_PATH: path,
            MOCHA_PER_FILE_PATTERN: pattern,
            MOCHA_PER_FILE_IS_CHDIR: isChdir,
          },
        },
      )
    } catch (error) {
      process.exit(1)
    }
  },
})

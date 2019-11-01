const { spawn } = require('child-process-promise')

let args = process.argv.slice(2)
const isChdir = args.includes('--chdir')

if (isChdir) {
  args = args.filter(arg => arg === '--chdir')
}

module.exports = () => spawn('mocha', [require.resolve('./test'), ...args], { stdio: 'inherit', env: { ...process.env, IS_CHDIR: isChdir } })

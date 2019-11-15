const { spawn } = require('child-process-promise')

let args = process.argv.slice(2)
const isChdir = args.includes('--chdir')
let folderName = (args[0] || '').startsWith('-') ? '' : (args[0] || '')

if (isChdir) {
  args = args.filter(arg => arg !== '--chdir')
}

if (folderName !== '') {
  args = args.slice(1)
} else {
  folderName = 'test'
}

module.exports = () => spawn('mocha', [require.resolve('./test'), ...args], { stdio: 'inherit', env: { ...process.env, IS_CHDIR: isChdir, TEST_FOLDER_NAME: folderName } })

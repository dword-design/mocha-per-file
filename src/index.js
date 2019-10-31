const { spawn } = require('child-process-promise')

module.exports = () => spawn('mocha', [require.resolve('./test'), ...process.argv.slice(2)], { stdio: 'inherit' })

const expect = require('expect')

module.exports = () => expect(process.cwd().endsWith('/test/works/test/a')).toBeFalsy()

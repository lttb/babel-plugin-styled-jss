const {syncParser} = require('prejss-postcss-parser')

module.exports = () => ({parse: syncParser})

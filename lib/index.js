/**
 * ejsonml-parser --- By longhao <longhaohe@gmail.com> (http://longhaohe.com/)
 * Github: https://github.com/longhaohe/ejsonml-parser
 * MIT Licensed.
 */

const ejmlParse = require('./parser.ejsonml')
const hsParse = require('./parser.javascript')

function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

class Parser {
  constructor (template) {
    this.template = template
    this.ejml = ejmlParse(this.template)
  }
  parse (debug) {
    let ejml = deepCopy(this.ejml[0])
    this.hs = hsParse(ejml, debug)
    return this.hs
  }
  nodeParse () {}
}

module.exports = Parser

/**
 * ejsonml-parser --- By longhao <longhaohe@gmail.com> (http://longhaohe.com/)
 * Github: https://github.com/longhaohe/ejsonml-parser
 * MIT Licensed.
 */

const EjsonmlParser = require('./parser.ejsonml')

module.exports = class Parser {
  constructor ({
    trim = true,
    comment = false,
  } = {}) {
    this.ejmlParser = new EjsonmlParser({
      trim,
      comment,
    })
    this.parsers = []
  }
  parse (template) {
    let ejml = this.ejmlParser.parse(template)
    this.walk(ejml)
    return ejml
  }
  walk (ejml) {
    this.parsers.forEach(parser => {
      parser.parse(ejml)
    })
  }
  install (parser) {
    this.parsers.push(parser)
  }
}

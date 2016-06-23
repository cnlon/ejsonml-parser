const htmlparser = require('htmlparser2')

const option = {
  decodeEntities: true,
}

let stack

module.exports = class Parser {
  constructor ({
    trim = true,
    comment = false,
  } = {}) {
    let config = {
      onopentag: Parser.opentag,
      onclosetag: Parser.closetag,
    }
    if (trim) {
      config.ontext = Parser.textWithTrim
    } else {
      config.ontext = Parser.text
    }
    if (comment) {
      config.oncomment = Parser.comment
    }
    this.parser = new htmlparser.Parser(config, option)
  }
  parse (template) {
    stack = [undefined, undefined, []]
    template = template.trim()
    this.parser.write(template)
    this.parser.end()
    return stack[2][0]
  }
  static opentag (name, attribs) {
    let child
    if ((attribs['*if'] || attribs['*for']) && name !== 'template') {
      let attr = {}
      if (attribs['*if']) {
        attr['*if'] = attribs['*if']
      }
      if (attribs['*for']) {
        attr['*for'] = attribs['*for']
      }
      delete attribs['*if']
      delete attribs['*for']
      child = ['*', attr, [], stack]
      stack[2].push(child)
      stack = child
    }
    child = [name, attribs, [], stack]
    stack[2].push(child)
    stack = child
  }
  static text (text) {
    stack[2].push(text)
  }
  static textWithTrim (text) {
    if (text && (text = text.trim())) {
      Parser.text(text)
    }
  }
  static closetag (tagname) {
    stack = stack.pop()
    if (stack[0] === '*') {
      stack[0] = 'template'
      stack = stack.pop()
    }
  }
  static comment (text) {
    stack[2].push(`<!--${text}-->`)
  }
}

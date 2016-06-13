const htmlparser = require('htmlparser2')

let stack, attr

const parser = new htmlparser.Parser({
  onopentag (name, attribs) {
    if (attribs['*if'] || attribs['*for']) {
      if (attribs['*if']) {
        attr = {
          '*if': attribs['*if'],
        }
      }
      if (attribs['*for']) {
        attr['*for'] = attribs['*for']
      }
      stack.push([stack, '*', attr])
      delete attribs['*if']
      delete attribs['*for']
      stack = stack[stack.length - 1]
    }
    stack.push([stack, name, attribs])
    stack = stack[stack.length - 1]
  },
  ontext (text) {
    stack.push(text)
  },
  onclosetag (tagname) {
    stack = stack.shift()
    if (stack[1] === '*') {
      stack = stack.shift()
    }
  },
  oncomment (text) {
    stack.push(`<!--${text}-->`)
  },
}, {
  decodeEntities: true,
})

function ejmlParse (template) {
  stack = []
  template = template.trim()
  parser.write(template)
  parser.end()
  return stack
}

module.exports = ejmlParse

const htmlparser = require('htmlparser2')

const interpolationRE = /\{\{.+\}\}/
const pascalPrefixRE = /^[A-Z]/
const hyphenRE = /\b-?(\w)/g
const lowerCaseCharRE = /[a-z]/

const COMMAND_TAG = 'COMMAND'
const ATTRIBUTE_COMMANDS = {
  '*if': 'if',
  '*elif': 'elif',
  '*else': 'else',
  '*for': 'for',
}
const ATTRIBUTE_COMMAND_KEYS = Object.keys(ATTRIBUTE_COMMANDS)
const ROLLBACK_COMMANDS = {
  'elif': 'if',
  'else': 'if',
}

const COMPONENT_TAG = 'COMPONENT'
const FRAGMENT_TAG = 'FRAGMENT'
const componentPrefixREs = {
  'normal': /^v-/,
  'namespace': /^v:/,
}

let stack

module.exports = class Parser {
  constructor ({
    trim = true,
    comment = false,
    componentPrefix,
  } = {}) {
    let config = {
      onopentag: Parser.opentag.bind(this),
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
    let option = {
      decodeEntities: true,
      recognizeSelfClosing: true,
    }
    if (componentPrefix) {
      if (componentPrefixREs[componentPrefix]) {
        componentPrefix = componentPrefixREs[componentPrefix]
      }
      this.isComponent = Parser.makeIsComponent(componentPrefix)
    } else {
      option.lowerCaseTags = false
      this.isComponent = Parser.isPascalCaseComponent
    }
    this.parser = new htmlparser.Parser(config, option)
  }
  parse (template) {
    stack = [FRAGMENT_TAG, {}, []]
    if (!template && !(template = template.trim())) {
      return stack
    }
    this.parser.write(template)
    this.parser.end()
    return stack[2].length === 1
      ? stack[2][0]
      : stack
  }
  static opentag (name, attribs) {
    let child, trueKey
    ATTRIBUTE_COMMAND_KEYS.forEach(key => {
      if (attribs[key] !== undefined) {
        trueKey = ATTRIBUTE_COMMANDS[key]
        if (trueKey === 'for') {
          child = [COMMAND_TAG, {
            type: trueKey,
            value: attribs[key],
          }, [], stack]
        } else {
          child = [COMMAND_TAG, {
            type: trueKey,
            values: [{
              key: trueKey,
              value: attribs[key],
            }],
          }, [], stack]
        }
        stack[2].push(child)
        stack = child
        delete attribs[key]
      }
    })
    let _name
    if ((_name = this.isComponent(name))) {
      if (_name !== 'Anchor') {
        attribs.use = _name
      }
      name = COMPONENT_TAG
    } else if (name === 'component') {
      name = COMPONENT_TAG
    } else if (name === 'template') {
      name = FRAGMENT_TAG
    }
    child = [name, attribs, [], stack]
    stack[2].push(child)
    stack = child
  }
  static text (text) {
    let left
    while (interpolationRE.test(text)) {
      left = RegExp['$`']
      if (left) {
        stack[2].push(left)
      }
      stack[2].push(RegExp['$&'])
      text = RegExp['$\'']
    }
    if (text) {
      stack[2].push(text)
    }
  }
  static textWithTrim (text) {
    if (text && (text = text.trim())) {
      Parser.text(text)
    }
  }
  static closetag (tagname) {
    stack = stack.pop()
    let children, before, current, index, rollbackCmd
    while (stack[0] === COMMAND_TAG) {
      stack = stack.pop()
      children = stack[2]
      index = children.length - 1
      current = children[index]
      current[2] = Parser.reviseCommandChildren(current[2])
      rollbackCmd = Parser.needRollback(current[1].type)
      if (!rollbackCmd) {
        continue
      }
      before = children[index - 1]
      if (!before) {
        throw new Error('Tag ' + tagname + ' with command ' + rollbackCmd + ' should have a previousSibling with command *if or *elif')
      }
      children.pop()
      before.push(current[2])
      before[1].values.push(current[1].values[0])
    }
  }
  static comment (text) {
    stack[2].push(`<!--${text}-->`)
  }
  static isPascalCaseComponent (name) {
    if (pascalPrefixRE.test(name)) {
      return name
    }
  }
  static makeIsComponent (re) {
    return function (name) {
      if (re.test(name)) {
        name = RegExp['$\'']
        name = name.replace(hyphenRE, ($0, $1) => {
          return lowerCaseCharRE.test($1)
            ? $1.toUpperCase()
            : $1
        })
        return name
      }
    }
  }
  static reviseCommandChildren (children) {
    return children.length === 1
      ? children[0]
      : [FRAGMENT_TAG, {}, children[0]]
  }
  static needRollback (cmd) {
    return ROLLBACK_COMMANDS[cmd]
  }
  static rollBack (attribs, cmd, cb) {
    const rolls = ROLLBACK_COMMANDS[cmd]
    for (let i = 0, l = rolls.length; i < l; i++) {
      if (attribs[rolls[i]] !== undefined) {
        cb(rolls[i])
        return
      }
    }
  }
}

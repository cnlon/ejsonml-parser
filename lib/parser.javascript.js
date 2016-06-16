const Gep = require('gep')

const defaultSubScopes = '$event,$index'

const gep = new Gep({
  scopes: {
    '_$': defaultSubScopes,
  },
  params: ['$', '_', '_$'],
})
const commentRE = /^<!--.*-->$/
const boundMap = {
  'class': ' ',
  'style': ';',
}
const childMap = {
  'text': true,
}

let toRuntime

function hsParse (ejml, debug) {
  toRuntime = !debug
  coverSubScope()
  return translate(ejml)
}

let child
function translate (ejml) {
  if (!ejml) {
    return ''
  } else if (Array.isArray(ejml)) {
    child = parseAttributes(ejml[1])
    if (child) {
      ejml.splice(2, ejml.length, child)
    } else {
      for (var i = 2, l = ejml.length; i < l; i++) {
        if (!commentRE.test(ejml[i])) {
          ejml[i] = translate(ejml[i])
        } else {
          ejml.splice(i, 1)
          l--
        }
      }
    }
  }
  return ejml
}

function parseAttributes (attributes) {
  let bindAttr, attr, child
  Object.keys(attributes).forEach(key => {
    if (key[0] === ':') { // attribute
      bindAttr = attributes[key]
      delete attributes[key]
      key = key.slice(1)
      attr = getTrimmedAttribute(attributes, key)
      if (attr) {
        bindAttr = `'${attr}'+(${bindAttr})`
      }
      bindAttr = gep.parse(bindAttr)
      bindAttr = gep.make(bindAttr, toRuntime)
      if (childMap[key]) {
        child = bindAttr
      } else {
        attributes[key] = bindAttr
      }
    } else if (key[0] === '@' || key === '*if') { // event or directive if
      bindAttr = attributes[key]
      bindAttr = gep.parse(bindAttr)
      bindAttr = gep.make(bindAttr, toRuntime)
      attributes[key] = bindAttr
    } else if (key === '*for') {
      bindAttr = attributes[key]
      bindAttr = bindAttr.split(' ')
      attr = bindAttr[0]
      bindAttr = bindAttr[2]
      bindAttr = gep.parse(bindAttr)
      bindAttr = gep.make(bindAttr, toRuntime)
      attributes[key] = bindAttr
      attributes['_forKey'] = attr
      coverSubScope(attr)
    }
  })
  return child
}

function getTrimmedAttribute (attributes, key) {
  if (!attributes.hasOwnProperty(key)) return
  let attr = attributes[key]
  attr = attr.trim()
  let bound = boundMap[key]
  if (bound && attr[attr.length - 1] !== bound) {
    attr += bound
  }
  return attr
}

function coverSubScope (scope) {
  scope = scope
        ? defaultSubScopes + ',' + scope
        : defaultSubScopes
  gep._scopeREs['_$'] = parseKeywordsToRE(scope)
}

function parseKeywordsToRE (keywords) {
  return new RegExp(
        '^(?:'
      + keywords
        .replace(/\$/g, '\\$')
        .replace(/,/g, '\\b|')
      + '\\b)'
    )
}

module.exports = hsParse

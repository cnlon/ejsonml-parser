// @flow

import Gep from 'gep'
import parse from './index'

const gep = new Gep()

let _toRuntime

export default function jsParse (template, toRuntime) {
  let jml = parse(template)
  _toRuntime = toRuntime
  return translate(jml)
}

function translate (jml) {
  let res
  if (!jml) {
    res = ''
  } else if (Array.isArray(jml)) {
    parseAttributes(jml[1], _toRuntime)
    jml[2].forEach(child => translate(child))
    return jml
  } else {
    res = jml
  }
  return res
}

function parseAttributes (attributes) {
  let val
  Object.keys(attributes).forEach(key => {
    if (key[0] === ':') {
      val = attributes[key]
      val = gep.parse(val)
      val = gep.make(val)
      if (!_toRuntime) {
        val = val.toString()
        attributes[key] = val
      } else {
        delete attributes[key]
        attributes[key.slice(1)] = val
      }
    }
  })
}

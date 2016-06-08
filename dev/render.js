// @flow

export default function render (jml, scope) {
  let res
  if (!jml) {
    res = ''
  } else if (Array.isArray(jml)) {
    let [node, attributes, children] = jml
    node = createNode(node)
    if (attributes) {
      setAttributes(node, attributes, scope)
    }
    if (children && children.length) {
      appendChildren(node, children, scope)
    }
    return node
  } else if (typeof jml === 'function') {
    res = render.eval(jml, scope)
  } else {
    res = jml
  }
  return createTextNode(res)
}

render.eval = function evaluate (func, scope) {
  try {
    return func(scope)
  } catch (err) {
    return undefined
  }
}

function createNode (tagName) {
  return document.createElement(tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function setAttributes (node, attributes, scope) {
  let attr, val
  Object.keys(attributes).forEach(key => {
    attr = document.createAttribute(key)
    val = attributes[key]
    if (typeof val === 'function') {
      val = render.eval(val, scope)
    }
    attr.nodeValue = val
    node.setAttributeNode(attr)
  })
}

function appendChildren (node, children, scope) {
  children.forEach(child => {
    node.appendChild(render(child, scope))
  })
}

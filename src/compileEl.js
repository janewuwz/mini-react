
import * as nodeuuid from 'node-uuid'

/**
 * transform virtual dom to real dom, (mount component)
 * @param {object} virtual dom tree
 */
export function realRender (tree) {
  const root = document.getElementById('root')
  walkTree(tree, root)
}

/**
 * recurse tree, mount every child on their parent
 * @param {object} virtual dom object
 * @param {object} parentNode
 */
export function walkTree (element, parent) {
  var dom = document.createElement(element.type)
  const uuid = nodeuuid.v4()
  dom.setAttribute('wz-id', uuid)
  element.uuid = uuid
  if (element.attr.length > 0) {
    element.attr.forEach(item => {
      var key = Object.keys(item)[0]
      dom[key] = item[key]
    })
  }
  if (element.text && element.text !== '') {
    dom.appendChild(document.createTextNode(element.text))
  }
  if (element.child.length > 0) {
    element.child.forEach(item => {
      // recurse child
      walkTree(item, dom)
    })
  }
  if (parent === undefined) {
    return dom
  }
  parent.appendChild(dom)
}

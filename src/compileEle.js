
import * as uid from 'node-uuid'

export function realRender (tree) {
  const root = document.getElementById('root')
  walkTree(tree, root)
}

export function walkTree (element, parent) {
  var dom = document.createElement(element.type)
  const uuid = uid.v4()
  dom.setAttribute('wz-id', uuid)
  element.uuid = uuid
  if (element.attr.length > 0) {
    element.attr.forEach(at => {
      var key = Object.keys(at)[0]
      dom[key] = at[key]
    })
  }
  parent.appendChild(dom)
  if (element.txt && element.txt !== '') {
    dom.appendChild(document.createTextNode(element.txt))
  }
  if (element.child.length > 0) {
    element.child.forEach(item => {
      walkTree(item, dom)
    })
  }
}

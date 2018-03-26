
export function realRender (tree) {
  Object.keys(tree).forEach((item, index) => {
    const value = tree[item]
    const ele = document.createElement(value.type)
    let ParentDom
    if (value.parent) {
      ParentDom = document.querySelectorAll(`[data-id="${value.parent}"]`)
    } else {
      ParentDom = document.getElementById('root')
    }
    if (value.attr.length > 0) {
      value.attr.forEach(val => {
        const k = Object.keys(val)[0]
        const v = val[k]

        if (typeof v === 'function') {
          ele[k] = v
        } else {
          ele.setAttribute(k, val[k])
        }
      })
    }
    if (value.txt) {
      const txtNode = document.createTextNode(value.txt)
      ele.appendChild(txtNode)
    }
    if (ParentDom.length === undefined) {
      ParentDom.appendChild(ele)
    } else {
      for (var vv of ParentDom) {
        vv.appendChild(ele)
      }
    }
    ele.setAttribute('data-id', item)
    if (value.child.length > 0) {
      value.child.forEach((sub, count) => {
        realRender(sub)
      })
    }
  })
}

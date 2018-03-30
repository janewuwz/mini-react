import * as _ from 'lodash'

export default function diff (curTree, prevTree) {
  walkObj(prevTree, curTree)
}

export function walkObj (prevs, curs) {
  const cur = Object.values(curs)[0]
  const preRootKey = Object.keys(prevs)[0]
  const prev = Object.values(prevs)[0]
  Object.keys(cur).map(item => {
    if (item === 'child') {
      prev.child.forEach((element, ind) => {
        walkObj(element, cur.child[ind])
      })
    }

    if (item === 'txt') {
      if (cur.txt !== prev.txt) {
        window.tree = window.prevTree
        prev.txt = cur.txt
        const tar = document.querySelectorAll(`[data-id="${preRootKey}"]`)
        for (var vv of tar) {
          vv.childNodes[0].nodeValue = prev.txt
        }
      }
    }
  })
}

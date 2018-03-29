import * as _ from 'lodash'

export default function diff (nextTree, curTree) {
  walkObj(curTree, nextTree)
}

export function walkObj (curs, nexts) {
  const next = Object.values(nexts)[0]
  const preRootKey = Object.keys(nexts)[0]
  const cur = Object.values(nexts)[0]
  Object.keys(next).map(item => {
    if (item === 'child') {
      cur.child.forEach((element, ind) => {
        walkObj(element, next.child[ind])
      })
    }

    if (item === 'txt') {
      // console.log(next.txt)
      // console.log(cur.txt)
      if (next.txt !== cur.txt) {
        // window.tree = window.nextTree
        const tar = document.querySelectorAll(`[data-id="${preRootKey}"]`)
        for (var vv of tar) {
          vv.childNodes[0].nodeValue = next.txt
        }
      }
    }
  })
}

import * as _ from 'lodash'
import { walkTree} from './compileEle'

let diffResult = []

export default function diff (curTree, prevTree) {
  walkObj(prevTree, curTree)
  diffResult.forEach(diffItem => {
    const {type, node, position} = diffItem
    if (type === 'ADD_NODE') {
      walkTree(node, position)
    }
    if (type === 'REMOVE_NODE') {
      position.removeChild(node)
    }
  })
  // diffResult.forEach(diffItem => {
  //   var targetDom = document.querySelectorAll(`[data-id="${diffItem.position}"]`)

  // })
}

export function walkObj (prevs, curs) {
  // add one item
  if (prevs.type === curs.type) {
    // compare child
    const prevChild = prevs.child
    const cursChild = curs.child
    const loneOne = Math.max(prevChild.length, cursChild.length)
    for (var i = 0; i < loneOne; i++) {
      if (prevChild[i] === undefined) {
        var targetId = prevChild[i - 1].uuid
        var target = document.querySelectorAll(`[wz-id="${targetId}"]`)[0].parentNode
        // add item
        diffResult.push({
          type: 'ADD_NODE',
          node: cursChild[i],
          position: target
        })
      } else if (cursChild[i] === undefined) {
        // remove child
        const prevKey = prevChild.map(item => item.key)
        const cursKey = cursChild.map(item => item.key)
        const diffKey = getDiffKey(prevKey, cursKey)
        diffKey.forEach(k => {
          var res = prevChild.find(c => c.key === k)
          diffResult.push({
            type: 'REMOVE_NODE',
            node: document.querySelectorAll(`[wz-id="${res.uuid}"]`)[0],
            position: document.querySelectorAll(`[wz-id="${prevChild[i].uuid}"]`)[0].parentNode
          })
        })
      } else {
        // compare every item
        walkObj(prevChild[i], cursChild[i])
      }
    }
  } else {
    // 彻底替换，重新渲染
  }
  // const cur = Object.values(curs)[0]
  // const preRootKey = Object.keys(prevs)[0]
  // const prev = Object.values(prevs)[0]
  // Object.keys(cur).map(item => {
  //   if (item === 'child') {
  //     prev.child.forEach((element, ind) => {
  //       walkObj(element, cur.child[ind])
  //     })
  //   }

  //   if (item === 'txt') {
  //     if (cur.txt !== prev.txt) {
  //       window.tree = window.prevTree
  //       prev.txt = cur.txt
  //       const tar = document.querySelectorAll(`[data-id="${preRootKey}"]`)
  //       for (var vv of tar) {
  //         vv.childNodes[0].nodeValue = prev.txt
  //       }
  //     }
  //   }
  // })
}

function getDiffKey (one, two) {
  const result = []
  const loneOne = one.length > two.length ? one : two
  loneOne.forEach(item => {
    if (!one.includes(item) || !two.includes(item)) {
      result.push(item)
    }
  })
  return result
}

import * as _ from 'lodash'
import { walkTree} from './compileEle'

let diffResult = []

export default function diff (curTree, prevTree) {
  diffResult = []
  walkObj(prevTree, curTree)
  diffResult.forEach(diffItem => {
    const {type, node, position} = diffItem
    if (type === 'ADD_NODE') {
      walkTree(node, position)
      window.tree = window.prevTree
    }
    if (type === 'REMOVE_NODE') {
      position.removeChild(node)
      window.tree = window.prevTree
    }
  })
  // diffResult.forEach(diffItem => {
  //   var targetDom = document.querySelectorAll(`[data-id="${diffItem.position}"]`)

  // })
}

export function walkObj (prevs, curs) {
  if (prevs.type === curs.type) {
    // compare child
    let prevC = prevs.child
    let cursC = curs.child
    const loneOne = Math.max(prevC.length, cursC.length)
    for (var i = 0; i < loneOne; i++) {
      let prevChild = prevs.child
      let cursChild = curs.child
      if (prevChild[i] === undefined) {
        var targetId = prevChild[i - 1].uuid
        var target = document.querySelectorAll(`[wz-id="${targetId}"]`)[0].parentNode
        // add item
        diffResult.push({
          type: 'ADD_NODE',
          node: cursChild[i],
          position: target
        })
        prevChild.push(cursChild[i])
      } else if (cursChild[i] === undefined) {
        // remove child
        let prevChild = prevs.child
        let cursChild = curs.child
        const prevKey = prevChild.map(item => item.key)
        const cursKey = cursChild.map(item => item.key)
        const diffKey = getDiffKey(prevKey, cursKey)
        diffKey.forEach(k => {
          var res = prevChild.find(c => c.key === k)
          var del
          prevChild.forEach((p, i) => {
            if (p.key === k) del = i
          })
          diffResult.push({
            type: 'REMOVE_NODE',
            node: document.querySelectorAll(`[wz-id="${res.uuid}"]`)[0],
            position: document.querySelectorAll(`[wz-id="${prevChild[i].uuid}"]`)[0].parentNode
          })
          prevChild.splice(del, 1)
        })
      } else {
        // compare every item
        walkObj(prevChild[i], cursChild[i])
      }
    }

    // compare attr
    let prevAttr = prevs.attr
    let curAttr = curs.attr
    const loneAttr = prevAttr.length > prevAttr.length ? prevAttr : curAttr
    loneAttr.map(item => Object.keys(item)[0]).forEach(name => {
      const cname = curAttr.find(c => c[name])
      const pname = prevAttr.find(p => p[name])
      if (typeof cname[name] === 'function' || typeof pname[name] === 'function') {
        // 过滤props
        return
      }
      if (cname[name] !== pname[name] || pname === undefined) {
        // modify attr | add attr
        pname[name] = cname[name]
        const n = name === 'className' ? 'class' : name
        document.querySelectorAll(`[wz-id="${prevs.uuid}"]`)[0].setAttribute(n, cname[name])
        window.tree = window.prevTree
      }
      if (cname === undefined) {
        // remove attr
        // delete prevAttr[name]
        // document.querySelectorAll(`[wz-id="${prevs.uuid}"]`)[0].removeAttribute(name)
        // window.tree = window.prevTree
      }
    })
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

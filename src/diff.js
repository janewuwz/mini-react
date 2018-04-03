import * as _ from 'lodash'
import {walkTree} from './compileEle'

let diffResult = []
let mmm = []
export default function diff (curTree, prevTree) {
  diffResult = []
  mmm = []
  walkObj('root', prevTree, curTree)
  var gg = _.cloneDeep(curTree) // next new
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
    if (type === 'MODIFY') {
      document.querySelectorAll(`[wz-id="${diffItem.node}"]`)[0].setAttribute('class', diffItem.content.className)
    }
  })
  sort('', gg, window.prevTree)
  mmm.forEach(m => {
    const {moveNode, positionNode} = m
    var mn = document.querySelectorAll(`[wz-id="${moveNode.uuid}"]`)[0]
    var pn = document.querySelectorAll(`[wz-id="${positionNode.uuid}"]`)[0]
    mn.parentNode.insertBefore(mn, pn)
  })
  mmm = []
  if (diffResult.length === 0) {
    // window.tree = window.prevTree
  }
  window.tree = window.prevTree
}

export function walkObj (root, prevs, curs) {
  if (prevs === undefined || curs === undefined) {
    return
  }
  if (prevs.type === curs.type) {
    // compare child
    let prevChild = prevs.child
    let cursChild = curs.child
    const loneOne = Math.max(prevChild.length, cursChild.length)
    // const prevKey = prevChild.map(item => item.key)
    // const cursKey = cursChild.map(item => item.key)
    const diffKey = test(prevs.uuid, prevChild, cursChild)
    while (diffKey.add.length > 0) {
      var adds = diffKey.add.shift()
      const {parent, node} = adds
      diffResult.push({
        type: 'ADD_NODE',
        position: document.querySelectorAll(`[wz-id="${parent}"]`)[0],
        node: node
      })
      prevChild.push(node)
    }
    while (diffKey.remove.length > 0) {
      var removes = diffKey.remove.pop()
      const {parent, node} = removes
      diffResult.push({
        type: 'REMOVE_NODE',
        position: document.querySelectorAll(`[wz-id="${parent}"]`)[0],
        node: document.querySelectorAll(`[wz-id="${node.uuid}"]`)[0]
      })
      prevs.child = prevs.child.filter(p => p.key !== node.key)
    }
    for (var i = 0; i < loneOne; i++) {
      const prevKey = prevChild.map(item => item.key)
      const cursKey = cursChild.map(item => item.key)
      if (prevChild[i] === undefined) {
        // add item
        const diffKey = getDiffKey(prevKey, cursKey)
        if (diffKey.length > 1) {
          // empty child
          diffKey.forEach((p, i) => {
            var res = cursChild.find(c => c.key === p)
            diffResult.push({
              type: 'ADD_NODE',
              position: document.querySelectorAll(`[wz-id="${prevs.uuid}"]`)[0],
              node: res
            })
          })
          prevs.child = [...cursChild]
          return
        }
      } else if (cursChild[i] === undefined) {
        // remove child
        // const diffKey = getDiffKey(prevKey, cursKey)
        if (diffKey.length > 1) {
          // batch remove nodes
          diffKey.forEach((p, i) => {
            var res = prevChild.find(c => c.key === p)
            diffResult.push({
              type: 'REMOVE_NODE',
              node: document.querySelectorAll(`[wz-id="${res.uuid}"]`)[0],
              position: document.querySelectorAll(`[wz-id="${prevChild[i].uuid}"]`)[0].parentNode,
              isReplace: true
            })
          })
          prevs.child = [...cursChild] // ??????
          return
        }
      } else {
        // compare every item
        walkObj('', prevChild[i], cursChild[i])
      }
    }
  } else {
    // 彻底替换，重新渲染

  }
}

function diffAttr (one, two) {
  // TODO txt
  // attr
  // two: after, one: before
  var len = Math.max(one.length, two.length)
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < two[i].attr.length; j++) {
      if (two[i].attr[j].className !== one[i].attr[j].className) {
        diffResult.push({
          type: 'MODIFY',
          node: one[i].uuid,
          content: two[i].attr[j]
        })
        one[i].attr[j] = {...two[i].attr[j]}
      }
    }
    if (one[i].child.length > 0) {
      diffAttr(one.child, two.child)
    }
  }
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
 // move node .....
// one is standard
function sort (m, one, two, index, n) {
  if (one.key) {
    if (one.key !== two.key) {
      // move
      const moveObj = n.child.find(item => item.key === one.key)
      if (m.child[index + 1]) {
        const positionObj = n.child.find(item => item.key === m.child[index + 1].key)
        n = n.child.filter(v => v.key === moveObj.key)
        n[index] = moveObj
        mmm.push({
          moveNode: moveObj,
          positionNode: positionObj
        })
        // moveNode.parentNode.insertBefore(moveNode, positionNode)
      }
    }
  }
  if (one.child.length > 0) {
    for (var i = 0; i < one.child.length; i++) {
      sort(one, one.child[i], two.child[i], i, two)
    }
  }
}

// one: prev   two: cur
function test (parentId, one, two) {
  const result = {add: [], remove: [], move: []}

  two.forEach((item, index) => {
    if (item.key) {
      var a = one.find(w => w.key === item.key)
      var b = two.find(w => w.key === item.key)

      // add key
      if (a === undefined) {
        result.add.push({parent: parentId, node: b})
      }
      // change key
      if (a !== undefined && b !== undefined) {
        // change attr

        if (a.child.length > 0 && b.child.length > 0) {
          // diff child attr
          diffAttr(a.child, b.child)
          walkObj(parentId, a, b)
        }
      }
    } else {
    }
  })
  one.forEach((item, index) => {
    if (item.key) {
      var a = one.find(w => w.key === item.key)
      var b = two.find(w => w.key === item.key)

      // remove key
      if (b === undefined) {
        result.remove.push({parent: parentId, node: a})
      }
      // change key
      if (a !== undefined && b !== undefined) {
        // change attr

        if (a.child.length > 0 && b.child.length > 0) {
          // diff child attr
          diffAttr(a.child, b.child)
          walkObj(parentId, a, b)
        }
      }
    } else {
    }
  })
  return result
}

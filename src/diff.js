import * as _ from 'lodash'
import { walkTree} from './compileEle'
import { Object } from 'core-js'

let diffResult = []

export default function diff (curTree, prevTree) {
  diffResult = []
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
  // sort('', gg, window.prevTree)
  // console.log(mmm)
  // mmm.forEach(l => {
  //   const {moveNode, targetNode} = l
  //   if (moveNode.nextSibling === targetNode) return
  //   moveNode.parentNode.insertBefore(moveNode, targetNode)
  //   // if (l.bad) {
  //   //   moveNode.parentNode.appendChild(moveNode)
  //   // }
  // })
  // mmm = []
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
      // if (cursChild[i] !== undefined && prevChild[i] !== undefined && !Array.isArray(cursChild[i]) && !Array.isArray(prevChild[i])) {
      //   if (prevChild[i].key !== cursChild[i].key) {

      //   }
      // }
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
        // batch add item
        // var targetId = prevChild[i - 1].uuid // bug
        // var target = document.querySelectorAll(`[wz-id="${targetId}"]`)[0].parentNode

        // diffResult.push({
        //   type: 'ADD_NODE',
        //   node: cursChild[i],
        //   position: target
        // })
        // prevChild.push(cursChild[i])
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
        // diffKey.forEach(k => {
        //   var res = prevChild.find(c => c.key === k)
        //   var del
        //   prevChild.forEach((p, i) => {
        //     if (p.key === k) del = i
        //   })
        //   diffResult.push({
        //     type: 'REMOVE_NODE',
        //     node: document.querySelectorAll(`[wz-id="${res.uuid}"]`)[0],
        //     position: document.querySelectorAll(`[wz-id="${prevChild[i].uuid}"]`)[0].parentNode
        //   })
        //   prevChild.splice(del, 1)
        // })
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

// var mmm = [] move node .....
function sort (m, one, two, index, n) {
  if (one.key) {
    if (two.key === one.key) {
      return
    }
    var moveId = m.find(item => item.key === one.key).uuid
    var moveNode = document.querySelectorAll(`[wz-id="${moveId}"]`)[0]
    if (n[index + 1]) {
      var position = n[index + 1].key
      var target = m.find(item => item.key === position).uuid
      var f = m.map(k => k.uuid).indexOf(target)
      var targetNode = document.querySelectorAll(`[wz-id="${target}"]`)[0]
      moveNode.parentNode.insertBefore(moveNode, targetNode)
      // 去掉已经移动的obj
      m[f] = undefined
      sort(m, one, two, index, n)
      // mmm.push({moveNode, targetNode})
    } else {
      // mmm.push({bad: true, moveNode})
    }
  }
  if (one.child.length > 0) {
    for (var i = 0; i < one.child.length; i++) {
      sort(two.child, one.child[i], two.child[i], i, one.child)
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

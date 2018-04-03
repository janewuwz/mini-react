import {walkTree} from './compileEle'
import cloneDeep from './utils/cloneDeep'  // I know why to need expose

let diffResult = []
let moveQueue = []
export default function diff (curTree, prevTree) {
  diffResult = []
  moveQueue = []
  walkObj('root', prevTree, curTree)
  var gg = cloneDeep(curTree) // next new
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
    if (type === 'MODIFY_NODE') {
      document.querySelectorAll(`[wz-id="${diffItem.node}"]`)[0].setAttribute('class', diffItem.content.className)
    }
  })
  sortNode('', gg, window.prevTree)
  moveQueue.forEach(m => {
    const {moveNode, positionNode} = m
    var mn = document.querySelectorAll(`[wz-id="${moveNode.uuid}"]`)[0]
    var pn = document.querySelectorAll(`[wz-id="${positionNode.uuid}"]`)[0]
    mn.parentNode.insertBefore(mn, pn)
  })
  moveQueue = []
  if (diffResult.length === 0) {
    // window.tree = window.prevTree
  }
  window.tree = window.prevTree
}

function findNodeByUuid (uuid) {
  return document.querySelectorAll(`[wz-id="${uuid}"]`)[0]
}

/**
 *
 * @param {*} root
 * @param {*} prevs
 * @param {*} curs
 */
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
    const diffKey = diffByKey(prevs.uuid, prevChild, cursChild)
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
        const diffKey = diffByKey(prevKey, cursKey)
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

/**
 *
 * @param {array} prevArr
 * @param {array} curArr
 */
function diffAttr (prevArr, curArr) {
  // TODO txt
  // modify attr
  var len = Math.max(prevArr.length, curArr.length)
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < curArr[i].attr.length; j++) {
      // only className
      if (curArr[i].attr[j].className !== prevArr[i].attr[j].className) {
        diffResult.push({
          type: 'MODIFY_NODE',
          node: prevArr[i].uuid,
          content: curArr[i].attr[j]
        })
        prevArr[i].attr[j] = {...curArr[i].attr[j]}
      }
    }
    if (prevArr[i].child.length > 0) {
      diffAttr(prevArr.child, curArr.child)
    }
  }
}

/**
 *
 * @param {object} initial standard parent
 * @param {object} ic standard child tree, It should have a key
 * @param {object} ac reference child tree, It should have a key
 * @param {number} index the traverse index
 * @param {object} accu accumulator
 */
function sortNode (initial, ic, ac, index, accu) {
  if (ic.key) {
    // need move node
    if (ic.key !== ac.key) {
      // find moved obj from sorted
      const moveObj = accu.child.find(item => item.key === ic.key)
      if (initial.child[index + 1]) {
        // find last obj before moved obj
        const positionObj = accu.child.find(item => item.key === initial.child[index + 1].key)
        // reduce current obj tree
        accu = accu.child.filter(v => v.key === moveObj.key)  // remove
        accu[index] = moveObj // insert
        // add move target and position (both include uuid)
        moveQueue.push({
          moveNode: moveObj,
          positionNode: positionObj
        })
      }
    }
  }
  // recursive every child (if have)
  if (ic.child.length > 0) {
    for (var i = 0; i < ic.child.length; i++) {
      sortNode(ic, ic.child[i], ac.child[i], i, ac)
    }
  }
}

/**
 *
 * @param {string} parentId
 * @param {object} prevone
 * @param {object} currentone
 */
function diffByKey (parentId, pre, cur) {
  const result = {add: [], remove: [], move: []}
  // based on current
  cur.forEach((item, index) => {
    if (item.key) {
      var a = pre.find(w => w.key === item.key)
      var b = cur.find(w => w.key === item.key)

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
  // based on previous
  pre.forEach((item, index) => {
    if (item.key) {
      var a = pre.find(w => w.key === item.key)
      var b = cur.find(w => w.key === item.key)

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

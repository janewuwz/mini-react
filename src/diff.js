import {walkTree} from './compileEle'
import cloneDeep from './utils/cloneDeep'  // I know why to need expose
import isEqual from './utils/isEqual'

let diffResult = []
let moveQueue = []
export default function diff (curTree, prevTree) {
  diffResult = []
  moveQueue = []
  walkObj('root', prevTree, curTree)
  var initial = cloneDeep(curTree) // next new
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
      findNodeByUuid(diffItem.node).setAttribute('class', diffItem.content.className)
    }
  })
  sortNode('', initial, window.prevTree)
  moveQueue.forEach(m => {
    const {moveNode, positionNode} = m
    var mn = findNodeByUuid(moveNode.uuid)
    var pn = findNodeByUuid(positionNode.uuid)
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
    const diffKey = diffByKey(prevs.uuid, prevChild, cursChild)
    while (diffKey.add.length > 0) {
      var adds = diffKey.add.shift()
      const {parent, node} = adds
      diffResult.push({
        type: 'ADD_NODE',
        position: findNodeByUuid(parent),
        node: node
      })
      prevChild.push(node)
    }
    while (diffKey.remove.length > 0) {
      var removes = diffKey.remove.pop()
      const {parent, node} = removes
      diffResult.push({
        type: 'REMOVE_NODE',
        position: findNodeByUuid(parent),
        node: findNodeByUuid(node.uuid)
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
              position: findNodeByUuid(prevs.uuid),
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
              node: findNodeByUuid(res.uuid),
              position: findNodeByUuid(prevChild[i].uuid).parentNode
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
 * find index in array by key
 * @param {*} arr
 * @param {*} target
 */
function getIndexOfArray (arr, targetKey) {
  return arr.map(item => item.key).indexOf(targetKey)
}

function delItem (arr, targetIndex) {
  arr.splice(targetIndex, 1)
}

function insertItem (arr, position, newItem) {
  arr.splice(position, 0, newItem)
}

/**
 *
 * @param {object} initParent standard parent obj
 * @param {object} initial standard obj
 * @param {object} accu accumulator obj
 * @param {number} index the traverse index
 * @param {object} accuParent accumulator parent obj
 */
function sortNode (parent, initial, accu, index, accuParent) {
  if (initial === undefined || accu === undefined) {
    return
  }
  if (initial.key) {
    // need move node
    if (initial.key !== accu.key) {
      var accuChilds = accuParent.child
      var initChilds = parent.child
      // find moved obj from sorted
      const moveObj = accuChilds.find(item => item.key === initial.key)
      if (initChilds[index - 1]) {
        const lastOneKey = initChilds[index - 1].key
        const positionIndex = getIndexOfArray(accuChilds, lastOneKey) + 1
        moveQueue.push({
          moveNode: moveObj,
          positionNode: accuChilds[positionIndex]
        })
        // consistent with real dom，simulate moving dom
        const removeIndex = getIndexOfArray(accuChilds, moveObj.key)
        delItem(accuChilds, removeIndex)
        const change = getIndexOfArray(accuChilds, lastOneKey) + 1
        insertItem(accuChilds, change, moveObj)
      } else {
        // the move node is the first node
        moveQueue.push({
          moveNode: moveObj,
          positionNode: accuChilds[0]
        })
        // consistent with real dom
        const removeIndex = getIndexOfArray(accuChilds, moveObj.key)
        delItem(accuChilds, removeIndex)
        accuChilds.unshift(moveObj)
      }
    }
  }
  // recursive every child (if have)
  if (initial.child.length > 0) {
    for (var i = 0; i < initial.child.length; i++) {
      sortNode(initial, initial.child[i], accu.child[i], i, accu)
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
      // no key
      if (cur.length > 0) {
        for (var i = 0; i < cur.length; i++) {
          for (var j = 0; j < cur[i].attr.length; j++) {
            var equal = isEqual(pre[i].attr[j], cur[i].attr[j])
            if (!equal) {
              pre[i].attr[j] = cur[i].attr[j]
              diffResult.push({
                type: 'MODIFY_NODE',
                node: pre[i].uuid,
                content: cur[i].attr[j]
              })
            }
          }
        }
      }
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
      if (cur.length > 0) {
        for (var i = 0; i < cur.length; i++) {
          for (var j = 0; j < cur[i].length; j++) {
            var equal = isEqual(pre[i][j], cur[i][j])
            console.log(equal)
          }
        }
      }
    }
  })
  return result
}

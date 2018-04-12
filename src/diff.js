import {walkTree} from './compileEl'
import cloneDeep from './utils/cloneDeep'  // I know why to need expose
import isEqual from './utils/isEqual'
import {context, updateContext} from './wz'

let diffResult = []
export default function diff (nextTree, curTree) {
  diffResult = []
  walkObj('root', curTree, nextTree)
  var initial = cloneDeep(nextTree) // the blueprint
  applyDiff(initial)
}

function findNodeByUuid (uuid) {
  return document.querySelectorAll(`[wz-id="${uuid}"]`)[0]
}

// apply diff result to virtual dom
function applyDiff (initial) {
  diffResult.forEach(diffItem => {
    const {type, node, position} = diffItem
    if (type === 'ADD_NODE') {
      walkTree(node, position)
      updateContext(window.prevTree)
    }
    if (type === 'REMOVE_NODE') {
      position.removeChild(node)
      updateContext(window.prevTree)
    }
    if (type === 'MODIFY_NODE') {
      // only className in the todo case
      var attrName = Object.keys(diffItem.content)[0]
      findNodeByUuid(diffItem.node)[attrName] = diffItem.content[attrName]
    }
    // if (type === 'REPLACE_NODE') {
    //   position.replaceChild(newNode, oldNode)
    // }
  })
  diffResult = []
  reorder('', initial, window.prevTree)
  //  move node
  diffResult.forEach(diffItem => {
    const {moveNode, positionNode} = diffItem
    var move = findNodeByUuid(moveNode.uuid) // the moved node
    var destination = findNodeByUuid(positionNode.uuid) // node after moved node which should be inserted here
    move.parentNode.insertBefore(move, destination)
  })
  updateContext(window.prevTree)
}

/**
 *
 * @param {string} parentId
 * @param {object} prevs
 * @param {object} next
 */
export function walkObj (root, curs, next) {
  if (curs === undefined || next === undefined) {
    return
  }
  if (curs.type === next.type) {
    // compare child
    let cursChild = curs.child
    let nextChild = next.child
    const diffKey = diffByKey(curs.uuid, cursChild, nextChild)
    // add add node to diff result
    while (diffKey.add.length > 0) {
      var adds = diffKey.add.shift()
      const {parent, node} = adds
      diffResult.push({
        type: 'ADD_NODE',
        position: findNodeByUuid(parent),
        node: node
      })
      cursChild.push(node)
    }
    // add remove node to diff result
    while (diffKey.remove.length > 0) {
      var removes = diffKey.remove.pop()
      const {parent, node} = removes
      diffResult.push({
        type: 'REMOVE_NODE',
        position: findNodeByUuid(parent),
        node: findNodeByUuid(node.uuid)
      })
      curs.child = curs.child.filter(p => p.key !== node.key)
    }
    // replace child
    // while (diffKey.replace.length > 0) {
    //   var replaces = diffKey.replace.shift()
    //   const {parent, newNode, oldNode} = replaces
    //   const parentNode = findNodeByUuid(parent)
    //   const newEl = walkTree(newNode)
    //   diffResult.push({
    //     type: 'REPLACE_NODE',
    //     position: parentNode,
    //     newNode: newEl,
    //     oldNode: findNodeByUuid(oldNode.uuid)
    //   })
    // }
  } else {
    // rebuild render
    walkTree(context)
  }
}

/**
 * diff the item attr and text who have same key
 * @param {object} cur
 * @param {object} next
 */
function diffModify (cur, next) {
  if (next === undefined || cur === undefined) return
  if (!isEqual(next.text, cur.text)) {
    // TODO diff text
  }
  for (var i = 0; i < next.attr.length; i++) {
    if (!isEqual(next.attr[i], cur.attr[i])) {
      diffResult.push({
        type: 'MODIFY_NODE',
        node: cur.uuid,
        content: next.attr[i]
      })
      cur.attr[i] = {...next.attr[i]}
    }
  }
}

function getIndexOfArray (arr, targetKey) {
  return arr.map(item => item.key).indexOf(targetKey)
}

function delItem (arr, targetIndex) {
  arr.splice(targetIndex, 1)
}

function insertItem (arr, position, newItem) {
  arr.splice(position, 0, newItem)
}

function replaceItem (arr, newone, oldone) {
  var index = getIndexOfArray(arr, oldone.key)
  arr.splice(index, 1, newone)
  return arr
}

/**
 *
 * @param {object} initParent standard parent obj
 * @param {object} initial standard obj
 * @param {object} accu accumulator obj
 * @param {? number} index the traverse index | not necessary
 * @param {? object} accuParent accumulator parent obj | not necessary
 */
function reorder (parent, initial, accu, index, accuParent) {
  if (initial === undefined || accu === undefined) {
    return
  }
  if (initial.key !== undefined) {
    // need move node
    if (initial.key !== accu.key) {
      var accuChilds = accuParent.child
      var initChilds = parent.child
      // find moved obj from sorted
      const moveObj = accuChilds.find(item => item.key === initial.key)
      if (initChilds[index - 1]) {
        const lastOneKey = initChilds[index - 1].key
        const positionIndex = getIndexOfArray(accuChilds, lastOneKey) + 1
        diffResult.push({
          type: 'MOVE_NODE',
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
        diffResult.push({
          type: 'MOVE_NODE',
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
  // recursing every child (if have)
  if (initial.child.length > 0) {
    for (var i = 0; i < initial.child.length; i++) {
      reorder(initial, initial.child[i], accu.child[i], i, accu)
    }
  }
}

/**
 *
 * @param {string} parentId
 * @param {array} currentone
 * @param {array} nextone
 * @returns {object} the item that new adds and removes
 */
function diffByKey (parentId, cur, next) {
  let temp = cur.map(item => item.key)
  const result = {add: [], remove: [], replace: []}
  // based on current
  for (var i = 0; i < next.length; i++) {
    var item = next[i]
    if (item.key !== undefined) {
      var curObj = cur.find(c => c.key === item.key)
      var nextObj = next.find(n => n.key === item.key)
      if (curObj !== undefined && nextObj !== undefined) {
        // same key
        diffModify(curObj, nextObj)
        walkObj(parentId, curObj, nextObj)
        temp.splice(temp.indexOf(item.key), 1)
      }
      // add key
      if (curObj === undefined) {
        // var compare = temp[i]
        // var isIn = getIndexOfArray(next, compare)
        // if (compare !== undefined && isIn === -1) {
        //   // replace
        //   result.replace.push({parent: parentId, newNode: nextObj, oldNode: cur[i]})
        //   replaceItem(cur, nextObj, cur[i])
        // }
        result.add.push({parent: parentId, node: nextObj})
      }
    }
  }
  cur.forEach(item => {
    if (item.key !== undefined) {
      var curObj = cur.find(c => c.key === item.key)
      var nextObj = next.find(n => n.key === item.key)
      if (nextObj === undefined) {
        result.remove.push({parent: parentId, node: curObj})
      }
    }
  })
  return result
}

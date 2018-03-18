// import diff from './diff'
import domObj from './domObj'
import uuid from 'node-uuid'

export default function compileEle (type, content, event) {
  const id = uuid.v4()
  if (type === domObj.type) {
    domObj.content = content
    return generateDom(domObj, false)
  }
  domObj.type = type
  domObj.content = content
  domObj.event = event
  return generateDom(domObj, true)
}

function generateDom (domObj, isNew) {
  if (!isNew) {
    const dom = document.getElementById('root')
    const target = dom.getElementsByTagName('button')[0]
    target.textContent = domObj.content
    return
  }
  // if (!isNew) {
  //   const root = document.getElementById('root')
  //   root && root.remove()
  // }
  const dom = document.createElement(domObj.type)
  // console.log(domObj.content)
  dom.textContent = domObj.content
  dom.addEventListener('click', domObj.event)
  return dom
}

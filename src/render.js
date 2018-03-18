export function render (component, Node) {
  console.log('RENDER')
  let node = Node
  let resu
  if (typeof Node === 'function') {
    node = new Node()
    node.ComponentWillMount()
    resu = node.render()
    node.ComponentDidMount()
  }
  node.ComponentWillUpdate()
  resu = node.render()
  node.ComponentDidUpdate()
  node.ComponentWillUnMount()

  if (resu) {
    component.appendChild(resu)
  }
  // component.appendChild(resu)
}

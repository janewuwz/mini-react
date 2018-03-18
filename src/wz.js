import {render} from './render'

function updateState (self) {
  return new Promise((resolve, reject) => {
    self.batchedState.forEach(element => {
      self.state = {
        ...self.state,
        ...element
      }
    })
    render(document.getElementById('root'), self)
  })
}

export default class Component {
  constructor () {
    this.jsx = null
    this.state = {}
    this.batchedState = []
    this.batchedCb = []
    this.setState = (newState, cb) => {
      this.batchedState.push(newState)
      // this.batched.forEach(item => {
      //   this.state = {
      //     ...this.state,
      //     ...item.newState
      //   }
      //   item.cb && item.cb()
      //   render(document.getElementById('root'), this)
      // })
      // this.state = {
      //   ...this.state,
      //   ...newState
      // }
      // render(document.getElementById('root'), this)
      updateState(this).then(cb && cb())
    }
  }
  ComponentWillMount () {

  }
  ComponentDidMount () {

  }
  ComponentWillUpdate () {
  }
  ComponentDidUpdate () {

  }
  ComponentWillUnMount () {

  }
  render () {
  }
}

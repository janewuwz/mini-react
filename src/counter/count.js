import {Component, makeElement} from '../wz'
import {render} from '../render'

class Instance extends Component {
  constructor() {
    super()
    this.state = {
      count: 1
    }
  }

  click1 = () => {
    this.setState({count: this.state.count + 1})
  }

  click2 = () => {
    this.setState({count: this.state.count - 1})
  }

  render () {
    /**
     * <div>
     *  <span><h1 name='haha'>h tag</h1></span>
     *  <span name='baz'>{count}</span>
     * </div>
     */
    const {count} = this.state
    return makeElement('div', { id: 'foo' }, makeElement('span', {name: 'bar'}, makeElement('h2', {name: 'haha', onclick: this.click1}, 'increase')), makeElement('span', {name: 'baz'}, count), makeElement('h2', {onclick: this.click2}, 'decrease'))
  }
}

render(document.getElementById('root'), Instance)

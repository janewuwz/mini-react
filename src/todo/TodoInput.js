/** @jsx makeElement */

import {Component, makeElement} from '../wz'
import './style.css'

export default class TodoInput extends Component {
  handleKeyPress = (e) => {
    const key = e.key;
    const value = e.target.value;
    if (value.trim() === '') {
      return
    }
    if (key === 'Enter') {
      e.target.value = '';
      this.props.onTodoItemAdded(value);
    }
  }
  render () {
    return <input type="text" className="input" onkeypress={this.handleKeyPress} placeholder="What need to do?" />
  }
}

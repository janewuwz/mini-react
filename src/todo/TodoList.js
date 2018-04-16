/** @jsx makeElement */

import {Component, makeElement} from '../wz'
import TodoItem from './TodoItem'

export default class TodoList extends Component {
  render () {
    const { todos, onTodoItemRemoved, onTodoItemToggled } = this.props
    return <div>{
      (todos || []).map((v, k) => <TodoItem onTodoItemRemoved={onTodoItemRemoved} onTodoItemToggled={onTodoItemToggled} todo={v} key={v.id} />)
    }</div>
  }
}

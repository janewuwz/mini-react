import {Component, makeElement} from '../wz'
import TodoItem from './TodoItem'

export default class TodoList extends Component {
  render () {
    /**
     * <div>
        {
          todos.length > 0
          ? todos.map((todo) => (
            <TodoItem
              key={todo.id}
              onTodoItemRemoved={onTodoItemRemoved}
              onTodoItemToggled={onTodoItemToggled}
              {...todo} />
            ))
          : null
        }
     * </div>
     */
    const { todos, onTodoItemRemoved, onTodoItemToggled } = this.props
    return makeElement('div', null, (todos || []).map(function (v, k) {
      return makeElement(TodoItem, {'onTodoItemRemoved': onTodoItemRemoved, 'onTodoItemToggled': onTodoItemToggled, todo: v, key: v.id}, '')
    }))
  }
}

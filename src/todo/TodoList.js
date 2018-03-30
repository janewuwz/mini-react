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
          : '할 일이 없습니다.'
        }
     * </div>
     */
    const { todos, onTodoItemRemoved, onTodoItemToggled } = this.props
    return makeElement('div', {}, (todos || []).map(function () {
      return makeElement(TodoItem, {'onTodoItemRemoved': onTodoItemRemoved, 'onTodoItemToggled': onTodoItemToggled, todos: todos}, '')
    }))
  }
}

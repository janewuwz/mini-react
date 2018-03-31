import {Component, makeElement} from '../wz'
import TodoList from './TodoList'
import TodoInput from './TodoInput'

export default class TodoApp extends Component {
  constructor() {
    super()
    this.state = {
      todos: [
        {
          id: new Date().getTime(),
          title: 'My Todo',
          complete: false
        },
        {
          id: new Date().getTime() + 1000,
          title: 'My Todo2',
          complete: false
        }
      ]
    }
  }
  handleTodoItemAdded = title => {

    this.setState({
      todos: this.state.todos.concat([
        {
          id: new Date().getTime(),
          title,
          complete: false
        }
      ])
    })
  }

  handleTodoItemRemoved = id => {
    this.setState({
      todos: this.state.todos.filter(item => item.id !== id)
    })
  }

  handleTodoItemToggled = id => {
    this.setState(prevState => {
      return {
        todos: prevState.todos.map(item => (
          item.id === id
            ? { ...item, complete: !item.complete }
            : item
        ))
      }
    })
  }


  render () {
    /**
      <div className="TodoApp">
        <TodoInput onTodoItemAdded={this.handleTodoItemAdded} />
        <TodoList
          todos={todos}
          onTodoItemToggled={this.handleTodoItemToggled}
          onTodoItemRemoved={this.handleTodoItemRemoved} />
      </div>
     */
    const { todos } = this.state;
    return makeElement('div', {}, makeElement(TodoInput, {'onTodoItemAdded': this.handleTodoItemAdded}, ''), makeElement(TodoList, {'todos': todos, 'onTodoItemToggled': this.handleTodoItemToggled, 'onTodoItemRemoved': this.handleTodoItemRemoved}, ''))
  }
}

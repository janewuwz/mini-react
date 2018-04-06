import {Component, makeElement} from '../wz'
import TodoList from './TodoList'
import TodoInput from './TodoInput'
import TodoFilter from './TodoFilter'

export default class TodoApp extends Component {
  constructor() {
    super()
    console.log('todo app cons')
    this.state = {
      show: 'all',
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
          id: new Date().getTime() + Math.ceil(Math.random() * 1000),
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
    this.setState({
      todos: this.state.todos.map(item => item.id === id ? {...item, complete: !item.complete} : item)
    })
  }

  handleFilter = (type) => {
    this.setState({todos: this.state.todos, show: type})
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
    const { todos, show } = this.state;
    let showTodos
    if (show === 'completed') {
      showTodos = todos.filter(todo => todo.complete)
    } else if (show === 'active') {
      showTodos = todos.filter(todo => !todo.complete)
    } else {
      showTodos = todos
    }
    return makeElement('div', {className: 'wrapper'}, makeElement('h2', {className: 'app'}, 'Todo App'), makeElement(TodoInput, {'onTodoItemAdded': this.handleTodoItemAdded}, ''), makeElement(TodoList, {todos: showTodos, 'onTodoItemToggled': this.handleTodoItemToggled, 'onTodoItemRemoved': this.handleTodoItemRemoved}, ''), makeElement(TodoFilter, {getFilter: this.handleFilter, show}, ''))
  }
}

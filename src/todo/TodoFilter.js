import {Component, makeElement} from '../wz'

export default class TodoFilter extends Component {
  getTodo = (type) => e => {
    const {getFilter} = this.props
    getFilter(type)
  }
  render () {
    const {show} = this.props
    const acStyle = show === 'active' ? 'underline' : 'filter'
    const coStyle = show === 'completed' ? 'underline' : 'filter'
    const alStyle = show === 'all' ? 'underline' : 'filter' 
    return makeElement('div', {className: 'filter-wrapper'}, makeElement('div', {className: coStyle, onclick: this.getTodo('completed')}, 'Completed'), makeElement('div', {className: acStyle, onclick: this.getTodo('active')}, 'Active'), makeElement('div', {className: alStyle, onclick: this.getTodo('all')}, 'All'))
  }
}

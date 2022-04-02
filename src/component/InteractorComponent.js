import Component from './Component'

export default class InteractorComponent extends Component {
	constructor(callback) {
		super()

		this.id = 'InteractorComponent'
		this.callback = callback
	}
}
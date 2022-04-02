import Component from './Component'

export default class InteractableComponent extends Component {
	constructor(callback) {
		super()

		this.callback = callback
		this.id = 'InteractableComponent'
	}

	init(p5) {
		super.init(p5)
		this.entity.collidable = true
	}
}
import Component from './Component'

export default class InteractableComponent extends Component {
	constructor(callback) {
		super()

		this.callback = callback
		this.id = 'InteractableComponent'
		this.colliding = null
		this.wasDown = false
		this.time = 0
	}

	init(p5) {
		super.init(p5)
		this.entity.collidable = true
	}

	update(p5, dt) {
		this.time += dt
	}

	handleEvent(e, data) {
		if (e == 'collision_started') {
			let component = data.entity.getComponent('InteractorComponent')

			if (data.entity != this.entity && component) {
				this.colliding = data.entity
				component.collidingWith = this.entity
			}
		} else if (e == 'collision_ended') {
			if (data.entity == this.colliding) {
				this.colliding = null
				let component = data.entity.getComponent('InteractorComponent')

				if (component.collidingWith == this.entity) {
					component.collidingWith = null
				}
			}
		}
	}
}
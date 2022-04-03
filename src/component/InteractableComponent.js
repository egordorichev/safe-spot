import Component from './Component'

export default class InteractableComponent extends Component {
	constructor(callback) {
		super()

		this.callback = callback
		this.id = 'InteractableComponent'
		this.colliding = null
		this.wasDown = false
	}

	init(p5) {
		super.init(p5)
		this.entity.collidable = true
	}

	update(p5, dt) {
		let down = p5.keyIsDown(69) || p5.keyIsDown(32) || p5.keyIsDown(70)

		if (this.colliding != null && down && !this.wasDown) {
			let component = this.colliding.getComponent('InteractorComponent')
			
			if (this.entity.owner != null || component.collidingWith == this.entity) {
				if (!this.callback(this.colliding)) {
					component.callback(this.entity)
				}
			}
		}

		this.wasDown = down
	}

	handleEvent(e, data) {
		if (e == 'collision_started') {
			let component = data.entity.getComponent('InteractorComponent')

			if (component) {
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
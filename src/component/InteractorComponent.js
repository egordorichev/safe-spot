import Component from './Component'

export default class InteractorComponent extends Component {
	constructor() {
		super()

		this.id = 'InteractorComponent'
		this.collidingWith = null
		this.wasDown = false
	}

	update(p5, dt) {
		let down = p5.keyIsDown(69) || p5.keyIsDown(32) || p5.keyIsDown(70)

		if (this.collidingWith != null && down && !this.wasDown && !this.entity.done) {
			let component = this.collidingWith.getComponent('InteractableComponent')

			if (component.time > 0.1 && (this.entity.owner != null || this.collidingWith != this.entity)) {
				if (component.callback(this.entity)) {
					let gc = this.entity.graphicsComponent

					if (gc) {
						gc.time = 0
					}
				}
				
				component.time = 0
			}
		}

		this.wasDown = down
	}
}
import Component from './Component'

export default class PlayerInputComponent extends Component {
	constructor() {
		super()
		this.id = 'PlayerInputComponent'
	}

	update(p5, dt) {
		let vx = 0
		let vy = 0
		let component = this.entity.getComponent('PlayerGraphicsComponent')

		if (p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(65)) {
			vx = -1
			component.flipped = true
		}

		if (p5.keyIsDown(p5.UP_ARROW) || p5.keyIsDown(87)) {
			vy = -1
		}

		if (p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown(68)) {
			vx += 1
			component.flipped = false
		}

		if (p5.keyIsDown(p5.DOWN_ARROW) || p5.keyIsDown(83)) {
			vy += 1
		}

		let d = Math.sqrt(vx * vx + vy * vy)

		if (d >= 1) {
			vx /= d
			vy /= d

			let s = dt * 0.1

			this.entity.x += vx * s
			this.entity.y += vy * s	
		}

		component.angle += ((d >= 1 ? -0.3 : 0) * (component.flipped ? 1 : -1) - component.angle) * 0.03 * dt
	}
}
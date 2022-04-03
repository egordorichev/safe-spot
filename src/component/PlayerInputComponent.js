import Component from './Component'

export default class PlayerInputComponent extends Component {
	constructor() {
		super()
		this.id = 'PlayerInputComponent'
		this.time = 0
		this.wasPressed = false
		this.wasUsePressed = false
		this.sfxTimer = 0
	}

	static controllerPressed(b) {
		var gamepads = navigator.getGamepads()
		let controller = gamepads[0]

		return controller == null ? null : controller.buttons[b].pressed
	}

	static controllerAxis(b) {
		var gamepads = navigator.getGamepads()
		let controller = gamepads[0]

		return controller == null ? 0 : controller.axes[b]
	}

	update(p5, dt) {
		let vx = PlayerInputComponent.controllerAxis(0)
		let vy = PlayerInputComponent.controllerAxis(1)
		let component = this.entity.getComponent('PlayerGraphicsComponent')

		if (p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(65) || PlayerInputComponent.controllerPressed(14)) {
			vx = -1
			component.flipped = true
			component.layer = 0
		}

		if (p5.keyIsDown(p5.UP_ARROW) || p5.keyIsDown(87) || PlayerInputComponent.controllerPressed(12)) {
			vy = -1
			component.layer = 2
		}

		if (p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown(68) || PlayerInputComponent.controllerPressed(15)) {
			vx += 1
			component.flipped = false
			component.layer = 0
		}

		if (p5.keyIsDown(p5.DOWN_ARROW) || p5.keyIsDown(83) || PlayerInputComponent.controllerPressed(13)) {
			vy += 1
			component.layer = 1
		}

		let d = Math.sqrt(vx * vx + vy * vy)
		let wasPressed

		if (d >= 1) {
			vx /= d
			vy /= d

			let s = dt * 0.1

			if (this.entity.item && this.entity.item.full) {
				s *= 0.5
			}

			this.entity.x += vx * s
			this.entity.y += vy * s	
			wasPressed = true
		} else {
			wasPressed = false
		}

		if (wasPressed != this.wasPressed) {
			if (!wasPressed) {
				component.sx = 2
				component.sy = 0
				component.animLength = 1
				component.animStart = 0
			} else {
				component.sx = 0
				component.sy = 2
				component.animLength = 6
				component.animStart = 1
				component.animSpeed = 5
			}
		}

		this.wasPressed = wasPressed

		wasPressed = p5.keyIsDown(32) || PlayerInputComponent.controllerPressed(1)

		if (this.wasUsePressed && !wasPressed) {
			component.sx = 2
			component.sy = 0

			if (this.entity.item != null) {
				this.entity?.item?.use()
			}
		}

		this.wasUsePressed = wasPressed

		this.time += dt * 0.001
		component.angle += ((Math.abs(vx) >= 1 ? -0.3 : Math.sin(this.time) * 0.05) * (component.flipped ? 1 : -1) - component.angle) * 0.03 * dt

		let s = dt * 0.01

		component.sx += (1 - component.sx) * s
		component.sy += (1 - component.sy) * s

		if (d > 0) {
			if (this.stepTimer == 0) {
				this.entity.steps[~~(Math.random(16) + 1)].play()
			}

			this.stepTimer += dt * 0.004

			if (this.stepTimer > 1) {
				this.stepTimer = 0
			}
		} else {
			this.stepTimer = 0
		}
	}
}
import Entity from './Entity'

export default class Camera extends Entity {
	constructor(target) {
		super()

		this.target = target
		this.width = 0
		this.height = 0
		this.scale = 5
		this.time = 0
	}

	init() {
		this.area.camera = this
	}

	update(p5, dt) {
		let s = dt * 0.005

		this.time += dt * 0.01
		this.x += (this.target.x - this.x) * s
		this.y += (this.target.y - this.y) * s
	}

	apply(p5, canvas) {
		let ox = 0
		let oy = 0

		if (this.shake) {
			ox = Math.sin(this.time) * 0.5
			oy = Math.cos(this.time * 0.7) * 1
		}

		canvas.scale(this.scale)
		canvas.translate(
			-this.x + canvas.width / 2 / this.scale + ox,
			-this.y + canvas.height / 2 / this.scale + oy)
	}

	renderGrid(p5, canvas) {
		canvas.stroke(100, 100, 100, 50)
		canvas.strokeWeight(1)

		const doubleScale = 2 * this.scale
		const width = canvas.width
		const height = canvas.height
		const cx = this.x
		const cy = this.y

		for (var x = (cx - width / doubleScale) - cx % 32; x <= cx + 8 + width / doubleScale; x += 32) {
			canvas.line(x, cy - height / doubleScale, x, cy + 8 + height / doubleScale)
		}

		for (var y = (cy - height / doubleScale) - cy % 32; y <= cy + 8 + height / doubleScale; y += 32) {
			canvas.line(cx - width / doubleScale, y, cx + 8 + width / doubleScale, y)
		}
	}
}
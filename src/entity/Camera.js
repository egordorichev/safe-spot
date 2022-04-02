import Entity from './Entity'

export default class Camera extends Entity {
	constructor(target) {
		super()

		this.target = target
		this.width = 0
		this.height = 0
		this.scale = 5
	}

	init() {
		this.area.camera = this
	}

	update(p5, dt) {
		let s = dt * 0.005

		this.x += (this.target.x - this.x) * s
		this.y += (this.target.y - this.y) * s
	}

	apply(p5, canvas) {
		canvas.scale(this.scale)
		canvas.translate(
			-this.x + canvas.width / 2 / this.scale,
			-this.y + canvas.height / 2 / this.scale)
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
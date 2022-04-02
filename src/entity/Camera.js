import Entity from './Entity'

export default class Camera extends Entity {
	constructor(target) {
		super()

		this.target = target
		this.width = 0
		this.height = 0
		this.scale = 3
	}

	update(p5, dt) {
		let s = dt * 0.005

		this.x += (this.target.x - this.x) * s
		this.y += (this.target.y - this.y) * s
	}

	apply(p5) {
		p5.scale(this.scale)
		p5.translate(
			-this.x + p5.windowWidth / 2 / this.scale,
			-this.y + p5.windowHeight / 2 / this.scale)
	}

	renderGrid(p5) {
		p5.stroke(100, 100, 100, 50)
		p5.strokeWeight(1)

		const doubleScale = 2 * this.scale
		const width = p5.windowWidth
		const height = p5.windowHeight
		const cx = this.x
		const cy = this.y

		for (var x = (cx - width / doubleScale) - cx % 32; x <= cx + 8 + width / doubleScale; x += 32) {
			p5.line(x, cy - height / doubleScale, x, cy + 8 + height / doubleScale)
		}

		for (var y = (cy - height / doubleScale) - cy % 32; y <= cy + 8 + height / doubleScale; y += 32) {
			p5.line(cx - width / doubleScale, y, cx + 8 + width / doubleScale, y)
		}
	}
}
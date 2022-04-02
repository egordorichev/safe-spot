import Entity from './Entity'

export default class Camera extends Entity {
	constructor(target) {
		super()
		this.target = target
	}

	update(p5, dt) {
		let s = dt * 0.005

		this.x += (this.target.x - this.x) * s
		this.y += (this.target.y - this.y) * s
	}

	apply(p5) {
		let scale = 3

		p5.scale(scale)
		p5.translate(
			-this.x + p5.windowWidth / 2 / scale,
			-this.y / 2 + p5.windowHeight / 2 / scale)
	}

	renderGrid(p5) {
		
	}
}
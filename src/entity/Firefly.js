import Entity from './Entity'

export default class Firefly extends Entity {
	addComponents() {
		this.drawOrder = 1
		this.time = Math.random() * 800
	}

	init(p5) {
		super.init(p5)

		this.ox = this.x
		this.oy = this.y
	}

	update(p5, dt) {
		this.time += dt * 0.001
		this.x = Math.cos(this.time * 0.1) * 64 + this.ox
		this.y = Math.sin(this.time * 0.077) * 64 + this.oy
	}

	render(p5, canvas) {
		const scale = this.area.camera.scale

		canvas.resetMatrix()
		canvas.scale(scale)
		
		canvas.translate(
			this.x - this.area.camera.x + p5.windowWidth / scale / 2 + this.width / 2, 
			this.y - this.area.camera.y + p5.windowHeight / scale / 2 + this.height / 2
		)

		canvas.noStroke()
		canvas.fill(113, 170, 52, 50)

		let d = Math.sin(this.time) * 0.2 + 0.5

		canvas.circle(0, 0, 6 * d, 6 * d)
		canvas.circle(0, 0, 16 * d, 16 * d)

		canvas.fill(113, 170, 52)
		canvas.circle(0, 0, 3, 3)
	}
}
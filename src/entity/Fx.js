import Entity from './Entity'

export default class Fx extends Entity {
	init(p5) {
		super.init(p5)

		this.size = Math.random() * 1.5 + 0.1
		this.speed = Math.random() * 3 + 1
		this.time = Math.random() * 100
	}

	update(p5, dt) {
		super.update(p5, dt)

		this.time += dt * 0.003
		this.x += dt * 0.02 * this.speed
		this.y += Math.sin(this.time * 0.1)

		const scale = this.area.camera.scale

		if (this.x > this.area.camera.x + p5.windowWidth / scale / 2) {
			this.x = this.area.camera.x - p5.windowWidth / scale / 2
			this.y = this.area.camera.y - p5.windowHeight / scale / 2 + Math.random() * (p5.windowHeight / scale)
		}
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
		canvas.fill(255, 255, 255, 50)

		let s = this.size

		canvas.rotate(this.time)
		canvas.rect(-s, -s, s * 2, s * 2)
		canvas.rect(-s * 1.5, -s * 1.5, s * 3, s * 3)
	}
}
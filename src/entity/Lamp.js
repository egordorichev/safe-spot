import Item from './Item'

export default class Lamp extends Item {
	addComponents() {
		super.addComponents()

		this.tags = ["light"]
		this.lightRadius = 1
		this.lr = 1
		this.time = 0

		let component = this.getComponent('AnimationComponent')
		component.layer = 6
		component.animLength = 10
		component.animSpeed = 5
	}

	update(p5, dt) {
		super.update(p5, dt)
		this.time += dt * 0.001

		this.lightRadius = Math.max(0.2, this.lr - dt * 0.000001)
		this.lr = this.lightRadius
		this.lightRadius += Math.cos(this.time) * 0.001
	}

	render(p5, canvas) {
		let component = this.getComponent('AnimationComponent')
		let d = (Math.sin(component.time * 0.1) * 5 + 16) * this.lightRadius
		component.position(p5, canvas, 0, 0)

		canvas.translate(0, -4)
		canvas.noStroke()
		canvas.fill(244, 180, 27, 50)
		canvas.circle(0, 0, d * 1.5, d * 1.5)
		canvas.fill(244, 180, 27, 50)
		canvas.circle(0, 0, d, d)

		super.render(p5, canvas)
	}
}
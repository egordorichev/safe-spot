import GraphicsComponent from '../component/GraphicsComponent';

export default class Entity {
	constructor() {
		this.x = 0
		this.y = 0
		this.width = 16
		this.height = 16
		this.done = false
		this.drawOrder = 0
		this.tags = []

		this.components = new Map()
		this.addComponents()
	}

	init(p5) {
		this.components.forEach(c => {
			c.init(p5)
		})
	}

	destroy() {
		this.components.forEach(c => {
			c.destroy()
		})
	}

	handleEvent(e, data) {
		this.components.forEach(c => {
			c.handleEvent(e, data)
		})
	}

	addComponents() {

	}

	addComponent(c) {
		this.components.set(c.id, c)
		c.entity = this

		if (c instanceof GraphicsComponent) {
			this.graphicsComponent = c
		}
	}

	getComponent(id) {
		return this.components.get(id)
	}

	update(p5, dt) {
		this.components.forEach(c => {
			c.update(p5, dt)
		})
	}
	
	render(p5, canvas) {
		if (this.graphicsComponent) {
			this.graphicsComponent.render(p5, canvas)
		}
	}

	distanceTo(e) {
		let dx = e.x - this.x
		let dy = e.y - this.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	distanceToCamera() {
		return this.distanceTo(this.area.camera)
	}
}
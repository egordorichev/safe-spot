import GraphicsComponent from '../component/GraphicsComponent';

export default class Entity {
	constructor() {
		this.x = 0
		this.y = 0
		this.width = 16
		this.height = 16
		this.done = false

		this.components = new Map()
		this.addComponents()
	}

	init() {
		this.components.forEach(c => {
			c.init()
		})
	}

	destroy() {
		this.components.forEach(c => {
			c.destroy()
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

	update(p5, dt) {
		this.components.forEach(c => {
			c.update(p5, dt)
		})
	}
	
	render(p5) {
		if (this.graphicsComponent) {
			this.graphicsComponent.render(p5)
		}
	}
}
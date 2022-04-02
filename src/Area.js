export default class Area {
	constructor(p5) {
		this.entities = []
		this.p5 = p5
	}

	add(e) {
		this.entities.push(e)
		e.area = this
		e.init(this.p5)
	}

	destroy() {
		this.entities.forEach(e => e.destroy())
	}

	update(p5, dt) {
		for (let i = this.entities.length - 1; i >= 0; i--) {
			this.entities[i].update(p5, dt)

			if (this.entities[i].done) {
				this.entities.splice(i, 1)
			}
		}
	}

	render(p5) {
		this.entities.forEach(e => e.render(p5))
	}
}
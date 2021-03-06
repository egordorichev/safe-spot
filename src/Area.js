function isColliding(a, b) {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	)
}

export default class Area {
	constructor(p5) {
		this.entities = []
		this.collidable = []
		this.tagged = new Map()
		this.p5 = p5
	}

	add(e) {
		this.entities.push(e)
		e.area = this
		e.init(this.p5)

		if (e.collidable) {
			this.collidable.push(e)
		}

		e.tags.forEach(tag => {
			let map = this.tagged.get(tag)
			
			if (!map) {
				map = []
				this.tagged.set(tag, map)
			}

			map.push(e)
		})
	}

	destroy() {
		this.entities.forEach(e => e.destroy())
	}

	update(p5, dt) {
		for (let i = this.entities.length - 1; i >= 0; i--) {
			this.entities[i].update(p5, dt)

			if (this.entities[i].done) {
				let e = this.entities[i]

				e.tags.forEach(tag => {
					let map = this.tagged.get(tag)
					map.splice(map.indexOf(e), 1)
				})

				let index = this.collidable.indexOf(e)

				if (index != -1) {
					this.collidable.splice(index, 1)
				}

				this.entities.splice(i, 1)
			}
		}

		this.entities.sort((a, b) => {
			if (a.drawOrder === b.drawOrder) {
				return a.y + a.height < b.y + b.height ? -1 : 1
			}

			return a.drawOrder > b.drawOrder ? 1 : -1
		})
	}

	render(p5, canvas) {
		let box = {
			x: this.camera.x - p5.windowWidth / 2 - 16,
			y: this.camera.y - p5.windowHeight / 2 - 16,
			width: p5.windowWidth + 32,
			height: p5.windowHeight + 32
		}
		this.entities.forEach(e => isColliding(e, box) && e.render(p5, canvas))
	}
}
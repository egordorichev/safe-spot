import Entity from './Entity'

export default class Map extends Entity {
	addComponents() {
		this.drawOrder = -2
		this.tiles = []
		this.minX = 0
		this.minY = 0
		this.maxX = 0
		this.maxY = 0
	}

	init(p5) {
		super.init(p5)
		this.sprite = p5.loadImage('ground.png')
	}

	setTile(x, y, t) {
		let array = this.tiles[y]

		if (!array) {
			array = []
			this.tiles[y] = array
		}

		array[x] = t

		this.minX = Math.min(this.minX, x)
		this.minY = Math.min(this.minY, y)
		this.maxX = Math.max(this.maxX, x)
		this.maxY = Math.max(this.maxY, y)
	}

	render(p5, canvas) {
		for (let y = this.minY; y < this.maxY; y++) {
			let row = this.tiles[y]

			if (!row) {
				continue
			}
			
			for (let x = this.minX; x < this.maxX; x++) {
				let tile = row[x]

				if (tile && tile > 0) {
					canvas.image(this.sprite, x * 16, y * 16, 16, 16, (tile - 1) * 16, 0, 16, 16)
				}
			}
		}
	}
}
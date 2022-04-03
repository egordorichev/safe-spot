import { waitForElementToBeRemoved } from '@testing-library/react'
import Entity from './Entity'

export default class Map extends Entity {
	addComponents() {
		this.drawOrder = -2
		this.tiles = []
		this.minX = 0
		this.minY = 0
		this.maxX = 0
		this.maxY = 0
		this.time = 0
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

	getTile(x, y) {
		let array = this.tiles[y]

		if (!array) {
			return 0
		}

		return array[x] ?? 0
	}

	update(p5, dt) {
		this.time += dt * 0.0001

		if (this.time >= 1) {
			this.time = 0
			let toRemove = []

			for (let y = this.minY; y <= this.maxY; y++) {
				let row = this.tiles[y]
	
				if (!row) {
					continue
				}
				
				for (let x = this.minX; x <= this.maxX; x++) {
					let tile = row[x]
	
					if (tile && tile > 0) {
						let neighbours = 0

						for (let ox = -1; ox <= 1; ox++) {
							for (let oy = -1; oy <= 1; oy++) {
								if ((ox != 0 || oy != 0) && this.getTile(x + ox, y + oy) != 0) {
									neighbours++
								}
							}
						}

						if (neighbours < 5 && Math.random() < 0.05) {
							toRemove.push([ x, y ])
						}
					}
				}
			}

			toRemove.forEach(coords => {
				this.setTile(coords[0], coords[1], 0)
			})
		}
	}

	render(p5, canvas) {
		for (let y = this.minY; y <= this.maxY; y++) {
			let row = this.tiles[y]

			if (!row) {
				continue
			}
			
			for (let x = this.minX; x <= this.maxX; x++) {
				let tile = row[x]

				if (tile && tile > 0) {
					canvas.image(this.sprite, x * 16, y * 16, 16, 16, (tile - 1) * 16, 0, 16, 16)
				}
			}
		}
	}
}
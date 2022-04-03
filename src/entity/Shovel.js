import Plant from './Plant'
import Tool from './Tool'

export default class Shovel extends Tool {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 5
		component.animSpeed = 5

		this.beingUsed = false
	}

	use() {
		if (this.beingUsed) {
			return
		}

		this.beingUsed = true
		let component = this.getComponent('AnimationComponent')

		component.animStart = 1
		component.animLength = 9 
		component.time = 0

		setTimeout(() => {
			component.animStart = 0
			component.animLength = 1

			this.beingUsed = false

			let x = Math.floor((this.owner.x + 8) / 16)
			let y = Math.floor((this.owner.y) / 16)
			let tile = this.area.map.getTile(x, y)

			if (tile == 7) {
				this.area.map.setTile(x, y, 8)
			} else {
				if (tile != 0) {
					let plant = new Plant()
					plant.x = x * 16
					plant.y = y * 16
					plant.getComponent('AnimationComponent').layer = 5

					this.area.add(plant)
				} else {
					this.area.map.setTile(x, y, ~~(Math.random() * 7) + 1)
				}
			}
		}, 2000)
	}
}
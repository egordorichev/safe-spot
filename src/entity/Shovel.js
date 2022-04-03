import Plant from './Plant'
import Tool from './Tool'
import { Howl } from 'howler'

let used = false

export default class Shovel extends Tool {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 5
		component.animSpeed = 5

		this.beingUsed = false

		this.sfx1 = new Howl({ src: ['sfx/shovel.wav'] })
		this.sfx2 = new Howl({ src: ['sfx/shovel2.wav'] })
	}

	use() {
		if (this.beingUsed) {
			return
		}

		if (Math.random() > 0.5) {
			this.sfx1.play()
		} else {
			this.sfx2.play()
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

	handlePickupInteraction(e) {
		super.handlePickupInteraction(e)

		if (!used) {
			used = true
			this.area.chat.print("shovel")
		}
	}
}
import Tool from './Tool'
import Campfire from './Campfire'
import Plant from './Plant'
import { Howl } from 'howler'

let used = false

export default class WateringCan extends Tool {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 7
		component.animSpeed = 5

		this.full = false
		this.sfx = new Howl({ src: ['sfx/can filling.wav'] })
		this.sfx2 = new Howl({ src: ['sfx/can pouring.wav'] })
	}

	fill() {
		let component = this.getComponent('AnimationComponent')
		component.animStart = 1
		this.sfx.play()

		this.full = true
	}

	empty() {
		let component = this.getComponent('AnimationComponent')
		component.animStart = 0
		this.sfx2.play()
		
		this.full = false
	}

	use() {
		let x = Math.floor((this.owner.x + 8) / 16)
		let y = Math.floor((this.owner.y) / 16)
		let tile = this.area.map.getTile(x, y)

		if (this.full) {
			this.empty()

			let component = this.owner.getComponent('InteractorComponent')
			let e = component.collidingWith

			if (e instanceof Campfire) {
				e.putOut()
			} else if (e instanceof Plant) {
				e.water()
			} else {
				this.area.map.setTile(x, y, 8)
			}
		} else {
			if (tile == 8) {
				this.area.map.setTile(x, y, 0)
				this.fill()
			}
		}
	}

	handlePickupInteraction(e) {
		super.handlePickupInteraction(e)

		if (!used) {
			used = true
			this.area.chat.print("watering_can")
		}
	}
}
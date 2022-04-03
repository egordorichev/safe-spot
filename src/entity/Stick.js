import Campfire from './Campfire'
import Item from './Item'
import Player from './Player'
import { Howl } from 'howler'

let used = false

export default class Stick extends Item {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 0

		this.sfx = new Howl({ src: ['sfx/branch.wav'] })
	}

	interact(e) {
		if (e instanceof Player) {
			let item = e.item

			if (item != this && item instanceof Stick) {
				this.done = true
				item.done = true
				e.item = null

				let campfire = new Campfire()
				campfire.x = this.x
				campfire.y = this.y
				this.area.add(campfire)
			}

			this.sfx.play()
			return this.handlePickupInteraction(e)
		}
	}



	handlePickupInteraction(e) {
		super.handlePickupInteraction(e)

		if (!used) {
			used = true
			this.area.chat.print("stick")
		}
	}
}
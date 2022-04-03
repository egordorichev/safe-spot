import Campfire from './Campfire'
import Item from './Item'
import Player from './Player'

export default class Stick extends Item {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 0
	}

	interact(e) {
		if (e instanceof Player) {
			setTimeout(() => {
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
			}, 0)

			return this.handlePickupInteraction(e)
		}
	}
}
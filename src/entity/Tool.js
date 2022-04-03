import Item from './Item'
let tutorialed = false

export default class Tool extends Item {
	use() {
	}

	handlePickupInteraction(e) {
		super.handlePickupInteraction(e)

		if (!tutorialed) {
			tutorialed = true
			this.area.chat.print("use")
		}
	}
}
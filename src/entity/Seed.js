import Item from './Item'
let used = false

export default class Seed extends Item {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 3
		component.animSpeed = 5
	}

	use() {
	}

	handlePickupInteraction(e) {
		super.handlePickupInteraction(e)

		if (!used) {
			used = true
			this.area.chat.print("seed")
		}
	}
}
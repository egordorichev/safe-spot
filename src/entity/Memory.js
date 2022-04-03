import Item from './Item'

export default class Memory extends Item {
	constructor(id) {
		super()
		this.id = id
	}

	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 8
		component.animSpeed = 5
	}

	handlePickupInteraction(e) {
		this.done = true
		this.area.chat.print(this.id)
	}
}
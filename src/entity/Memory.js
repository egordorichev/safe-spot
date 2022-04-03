import Item from './Item'

export default class Memory extends Item {
	constructor(id, i) {
		super()

		this.i = i
		this.id = id
	}

	init(p5) {
		super.init(p5)

		let component = this.getComponent('AnimationComponent')
		component.layer = 8 + this.i
		component.animSpeed = 5
	}

	handlePickupInteraction(e) {
		this.done = true
		this.area.chat.print(this.id)
		this.area.memoriesCollected++
	}
}
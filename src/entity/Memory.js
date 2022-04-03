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

		setTimeout(() => {
			this.area.memoriesCollected++
		}, 5000)

		e.getComponent('PlayerInputComponent').disabled = true
		let component = e.getComponent('PlayerGraphicsComponent')

		component.layer = 3
		component.animLength = 19

		setTimeout(() => {
			e.getComponent('PlayerInputComponent').disabled = false
			component.layer = 0
			component.animLength = 7
			component.animLength = 1
		}, 2000)
	}
}
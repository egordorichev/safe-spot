import Item from './Item'

export default class Seed extends Item {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 3
		component.animSpeed = 5
	}

	use() {
	}
}
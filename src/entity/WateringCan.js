import Item from './Item'

export default class WateringCan extends Item {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 7
		component.animSpeed = 5
	}

	use() {
	}
}
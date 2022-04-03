import Tool from './Tool'

export default class WateringCan extends Tool {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 7
		component.animSpeed = 5
	}

	use() {
	}
}
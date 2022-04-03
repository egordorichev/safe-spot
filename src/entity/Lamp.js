import Item from './Item'

export default class Lamp extends Item {
	addComponents() {
		super.addComponents()

		this.tags = ["light"]
		this.lightRadius = 1


		let component = this.getComponent('AnimationComponent')
		component.layer = 6
	}
}
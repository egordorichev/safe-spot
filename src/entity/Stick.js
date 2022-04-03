import Item from './Item'

export default class Stick extends Item {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 0
	}
}
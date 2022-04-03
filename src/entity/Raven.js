import AnimationComponent from '../component/AnimationComponent'
import Entity from './Entity'

export default class Raven extends Entity {
	addComponents() {
		let animation = new AnimationComponent('ravens.png')
		this.addComponent(animation)

		animation.animLength = 8
		animation.animSpeed = 2

		this.width = 32
		this.height = 32
	}
}
import AnimationComponent from '../component/AnimationComponent'
import Entity from './Entity'

export default class Plant extends Entity {
	addComponents() {
		this.addComponent(new AnimationComponent('plant.png'))
	}
}
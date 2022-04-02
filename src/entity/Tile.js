import AnimationComponent from '../component/AnimationComponent'
import Entity from './Entity'

export default class Tile extends Entity {
	addComponents() {
		this.addComponent(new AnimationComponent('ground.png'))
		this.getComponent('AnimationComponent').animStart = ~~(Math.random() * 6)

		this.drawOrder = -1
	}
}
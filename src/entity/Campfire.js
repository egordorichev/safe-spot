import AnimationComponent from '../component/AnimationComponent'
import Entity from './Entity'

export default class Campfire extends Entity {
	addComponents() {
		this.addComponent(new AnimationComponent('fire.png'))
		this.time = 0
		this.tags = ["light"]
	}

	update(p5, dt) {
		this.time += dt * 0.005
		let component = this.getComponent('AnimationComponent')

		component.sx = 0.9 + Math.sin(this.time) * 0.1
		component.sy = 0.9 + Math.cos(this.time) * 0.1
		component.angle = Math.cos(this.time * 0.7) * 0.05 
	}
}
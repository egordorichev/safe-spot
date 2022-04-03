import AnimationComponent from '../component/AnimationComponent'
import Entity from './Entity'

export default class Plant extends Entity {
	addComponents() {
		let animation = new AnimationComponent('plant.png')
		this.addComponent(animation)

		animation.layer = ~~(Math.random() * 5)
	}

	render(p5, canvas) {
		p5.push()
		this.graphicsComponent.position(p5, canvas, 0, 0)
		canvas.rotate(Math.sin(this.graphicsComponent.time * 0.5) * 0.1)
		this.graphicsComponent.draw(p5, canvas, 0, 0)
		p5.pop()
	}
}
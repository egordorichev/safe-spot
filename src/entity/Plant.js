import AnimationComponent from '../component/AnimationComponent'
import InteractableComponent from '../component/InteractableComponent'
import Entity from './Entity'
import Player from './Player'
import Stick from './Stick'
import Seed from './Seed'

export default class Plant extends Entity {
	addComponents() {
		let animation = new AnimationComponent('plant.png')
		this.addComponent(animation)

		animation.layer = ~~(Math.random() * 5)

		this.addComponent(new InteractableComponent(this.interact.bind(this)))
	}

	interact(e) {
		if (e instanceof Player) {
			this.done = true
			let items = []

			for (let i = 0; i <= ~~(Math.random() * 2); i++) {
				items.push(new Stick())
			}

			for (let i = 0; i <= ~~(Math.random() * 2); i++) {
				items.push(new Seed())
			}

			for (let i = 0; i < items.length; i++) {
				let a = i / items.length * Math.PI * 2;
				let item = items[i]
				let d = 16

				item.x = this.x + this.width / 2 + Math.cos(a) * d
				item.y = this.y + this.height / 2 + Math.sin(a) * d
				
				let component = item.graphicsComponent

				component.sx = 3
				component.sy = 0

				this.area.add(item)
			}
		}
	}

	render(p5, canvas) {
		p5.push()
		this.graphicsComponent.position(p5, canvas, 0, 0)
		canvas.rotate(Math.sin(this.graphicsComponent.time * 0.5) * 0.1)
		this.graphicsComponent.draw(p5, canvas, 0, 0)
		p5.pop()
	}
}
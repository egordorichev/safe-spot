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

	update(p5, dt) {
		super.update(p5, dt)

		if (this.graphicsComponent.time > 20) {
			this.graphicsComponent.time = 0

			let x = Math.floor((this.x + 8) / 16)
			let y = Math.floor((this.y) / 16)
			let tile = this.area.map.getTile(x, y)

			for (let ox = -2; ox <= 2; ox++) {
				for (let oy = -2; oy <= 2; oy++) {
					let d = Math.sqrt(ox * ox + oy * oy)

					if (Math.random() < 0.8 / d && this.area.map.getTile(x + ox, y + oy) == 0) {
						this.area.map.setTile(x + ox, y + oy, ~~(Math.random() * 6) + 1)
					}
				}
			}
		}
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

	water() {

	}
}
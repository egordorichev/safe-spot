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
		this.watered = false

		this.addComponent(new InteractableComponent(this.interact.bind(this)))
	}

	update(p5, dt) {
		super.update(p5, dt)

		if (this.graphicsComponent.time > 20) {
			this.graphicsComponent.time = 0

			let x = Math.floor((this.x + 8) / 16)
			let y = Math.floor((this.y) / 16)

			for (let ox = -2; ox <= 2; ox++) {
				for (let oy = -2; oy <= 2; oy++) {
					let d = Math.sqrt(ox * ox + oy * oy)

					if (Math.random() < 0.8 / d && this.area.map.getTile(x + ox, y + oy) == 0) {
						this.area.map.setTile(x + ox, y + oy, ~~(Math.random() * 6) + 1)
					}
				}
			}
		}

		this.time += dt * 0.001

		let component = this.getComponent('AnimationComponent')
		
		if (component.layer == 5) {
			if (component.animStart == 0) {
				this.time = 0
			}

			if (component.animStart == 1 && !this.watered) {
				this.time = 0
			}

			if (this.time >= 10) {
				component.animStart++
				this.time = 0

				if (component.animStart == 3) {
					component.animStart = 0
					component.layer = ~~(Math.random() * 5)
					this.time = Math.random() * 30
				}
			}
		} else if (this.time >= 100) {
			this.done = true

			let stick = new Stick()
			stick.x = this.x
			stick.y = this.y
			this.area.add(stick)
		}
	}

	interact(e) {
		if (e instanceof Player) {
			let component = this.getComponent('AnimationComponent')
			
			if (component.layer == 5) {
				if (component.animStart != 0) {
					return true
				}

				let item = e.item

				console.log(item)
				if (item instanceof Seed) {
					component.animStart = 1
					e.dropItem()
					item.done = true
				}

				return true
			}

			this.done = true
			let items = []

			for (let i = 0; i <= ~~(Math.random() * 2); i++) {
				items.push(new Stick())
			}

			if (Math.random() < 0.7) {
				items.push(new Seed())
			}

			let start = Math.random() * Math.PI * 2

			for (let i = 0; i < items.length; i++) {
				let a = i / items.length * Math.PI * 2 + start
				let item = items[i]
				let d = Math.random() * 8 + 8

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
		this.wated = true
	}
}
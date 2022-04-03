import AnimationComponent from '../component/AnimationComponent'
import InteractableComponent from '../component/InteractableComponent'
import Entity from './Entity'
import Player from './Player'

export default class Item extends Entity {
	addComponents() {
		this.addComponent(new InteractableComponent(this.interact.bind(this)))

		let animation = new AnimationComponent('inst.png')
		this.addComponent(animation)

		animation.flipped = Math.random() > 0.5

		this.width = 8
		this.height = 8
		this.wasDown = false
		this.tags = ["item"]
	}

	interact(e) {
		if (e instanceof Player) {
			return this.handlePickupInteraction(e)
		}
	}

	handlePickupInteraction(e) {
		e.pickup(this)
		let component = this.getComponent('AnimationComponent')

		component.sx = 3
		component.sy = 0
		component.time = 0

		return true
	}

	update(p5, dt) {
		super.update(p5, dt)
		let component = this.getComponent('AnimationComponent')

		if (this.owner != null) {
			if (this.done) {
				this.owner = null
			} else {
				this.x = this.owner.x + 4
				this.y = this.owner.y + 4
				component.flipped = this.owner.graphicsComponent.flipped
			}

			let down = (p5.keyIsDown(69) || p5.keyIsDown(70))

			if (component.time > 0.3 && down && !this.wasDown) {
				setTimeout(() => {
					if (this.owner && this.owner.graphicsComponent.time > 0.3) {
						component.time = 0
						this.getComponent('InteractableComponent').time = 0
						this.owner?.dropItem()
					}
				}, 0)
			}

			this.wasDown = down
		}

		let s = dt * 0.01

		component.sx += (1 - component.sx) * s
		component.sy += (1 - component.sy) * s

		if (this.owner == null) {
			component.oy = Math.cos(component.time * 0.9) * 2
		} else {
			component.oy = 0
		}

		component.angle = Math.sin(component.time) * 0.1
	}
}
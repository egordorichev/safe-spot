import AnimationComponent from '../component/AnimationComponent'
import InteractableComponent from '../component/InteractableComponent'
import Entity from './Entity'
import Player from './Player'
import Stick from './Stick'

export default class Campfire extends Entity {
	addComponents() {
		let animation = new AnimationComponent('fire.png')
		this.addComponent(animation)

		animation.animLength = 13
		animation.animSpeed = 5

		this.addComponent(new InteractableComponent(this.interact.bind(this)))

		this.time = 0
		this.tags = ["light"]
		this.lightRadius = 1
	}

	interact(e) {
		if (e instanceof Player) {
			let item = e.item

			if (item != null && item.done) {
				return false
			}

			if (item instanceof Stick) {
				e.dropItem()
				item.done = true

				this.time -= 1

				let component = this.getComponent('AnimationComponent')

				component.sx = 3
				component.sy = 0
			}

			return true
		}
	}

	update(p5, dt) {
		super.update(p5, dt)

		this.time += dt * 0.001
		let component = this.getComponent('AnimationComponent')

		let s = dt * 0.01

		component.sx += ((0.9 + Math.sin(this.time) * 0.1) - component.sx) * s
		component.sy += ((0.9 + Math.cos(this.time) * 0.1) - component.sy) * s
		component.angle = Math.cos(this.time * 0.7) * 0.05 

		this.lightRadius = Math.max(0, 1 - this.time * 0.01)

		if (this.lightRadius < 0) {
			this.done = true
		}

		this.lightRadius += Math.cos(this.time) * 0.1
	}
}
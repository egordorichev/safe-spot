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
	}

	interact(e) {
		if (e instanceof Player && this.owner == null) {
			return this.handlePickupInteraction(e)
		}
	}

	handlePickupInteraction(e) {
		e.pickup(this)
		let component = this.getComponent('AnimationComponent')

		component.sx = 3
		component.sy = 0

		return true
	}

	update(p5, dt) {
		super.update(p5, dt)

		if (this.owner != null) {
			if (this.done) {
				this.owner = null
			} else {
				this.x = this.owner.x + 4
				this.y = this.owner.y - 3
			}
		}

		let s = dt * 0.01
		let component = this.getComponent('AnimationComponent')

		component.sx += (1 - component.sx) * s
		component.sy += (1 - component.sy) * s

		if (this.owner == null) {
			component.oy = 0
		} else {
			component.oy = Math.cos(component.time * 0.9) * 2
		}

		component.angle = Math.sin(component.time) * 0.1
	}
}
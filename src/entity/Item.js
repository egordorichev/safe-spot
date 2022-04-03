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
			e.pickup(this)
			let component = this.getComponent('AnimationComponent')

			component.sx = 3
			component.sy = 0

			return true
		}
	}

	update(p5, dt) {
		super.update(p5, dt)

		if (this.owner != null) {
			this.x = this.owner.x + 4
			this.y = this.owner.y - 3
		}

		let s = dt * 0.01
		let component = this.getComponent('AnimationComponent')

		component.sx += (1 - component.sx) * s
		component.sy += (1 - component.sy) * s
	}
}
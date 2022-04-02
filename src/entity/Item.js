import AnimationComponent from '../component/AnimationComponent'
import InteractableComponent from '../component/InteractableComponent'
import Entity from './Entity'
import Player from './Player'

export default class Item extends Entity {
	addComponents() {
		this.addComponent(new InteractableComponent(this.interact.bind(this)))
		this.addComponent(new AnimationComponent('tmp.png'))

		this.width = 8
		this.height = 8
	}

	interact(e) {
		if (e instanceof Player) {
			e.pickup(this)
		}
	}

	update(p5, dt) {
		super.update(p5, dt)

		if (this.owner != null) {
			this.x = this.owner.x + 4
			this.y = this.owner.y + 4
		}
	}
}
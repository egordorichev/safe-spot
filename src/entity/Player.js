import Entity from '../entity/Entity'
import PlayerGraphicsComponent from '../component/PlayerGraphicsComponent'
import PlayerInputComponent from '../component/PlayerInputComponent'
import CollisionCheckerComponent from '../component/CollisionCheckerComponent'
import InteractorComponent from '../component/InteractorComponent'
import Item from './Item'

export default class Player extends Entity {
	init(p5) {
		super.init(p5)
		this.item = null
	}
	
	addComponents() {
		this.addComponent(new PlayerGraphicsComponent())
		this.addComponent(new PlayerInputComponent())
		this.addComponent(new CollisionCheckerComponent())
		this.addComponent(new InteractorComponent(this.interact.bind(this)))
		this.tags = ["light"]
	}	

	interact(e) {
		if (e instanceof Item) {
			this.pickup(e)
		}
	}

	pickup(item) {
		if (!this.dropItem()) {
			item.owner = this
			this.item = item
		}
	}

	dropItem() {
		if (this.item == null) {
			return false
		}

		this.item.owner = null
		this.item = null

		return true
	}
}
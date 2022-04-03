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
		this.lightRadius = 1
	}	

	interact(e) {
		if (e instanceof Item) {
			this.pickup(e)
		}
	}

	pickup(item) {
		if (!this.dropItem()) {
			item.owner = this

			this.getComponent('InteractorComponent').collidingWith = null
			this.item = item
			this.item.drawOrder = 1

			let component = this.getComponent('PlayerGraphicsComponent')

			component.sx = 2
			component.sy = 0
		}
	}

	dropItem() {
		if (this.item == null) {
			return false
		}

		this.item.owner = null
		this.item.drawOrder = 0

		let component = this.item.getComponent('AnimationComponent')

		component.sx = 3
		component.sy = 0

		component = this.getComponent('PlayerGraphicsComponent')

		component.sx = 2
		component.sy = 0

		this.handleEvent('collision_started', {
			entity: this.item
		})

		this.item.handleEvent('collision_started', {
			entity: this
		})

		this.item = null

		return true
	}
}
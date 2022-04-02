import Entity from '../entity/Entity'
import PlayerGraphicsComponent from '../component/PlayerGraphicsComponent'
import PlayerInputComponent from '../component/PlayerInputComponent'
import CollisionCheckerComponent from '../component/CollisionCheckerComponent'

export default class Player extends Entity {
	init(p5) {
		super.init(p5)
		this.item = null
	}
	
	addComponents() {
		this.addComponent(new PlayerGraphicsComponent())
		this.addComponent(new PlayerInputComponent())
		this.addComponent(new CollisionCheckerComponent(this.onCollisionStart.bind(this), this.onCollisionEnd.bind(this)))
	}	

	onCollisionStart(e) {
		console.log('start ', e)
	}

	onCollisionEnd(e) {
		console.log('end ', e)
	}

	pickup(item) {
		this.dropItem()
		item.owner = this
	}

	dropItem() {
		if (this.item == null) {
			return
		}

		this.item.owner = this
	}
}
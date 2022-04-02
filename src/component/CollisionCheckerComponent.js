import Component from './Component'

function isColliding(a, b) {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	);
}

export default class CollisionCheckerComponent extends Component {
	constructor(onCollisionStart, onCollisionEnd) {
		super()

		this.onCollisionStart = onCollisionStart
		this.onCollisionEnd = onCollisionEnd
		this.collidingWith = []
	}

	update(p5, dt) {
		this.entity.area.collidable.forEach(e => {
			if (e !== this.entity && isColliding(e, this.entity)) {
				let index = this.collidingWith.indexOf(e)

				if (index === -1) {
					this.collidingWith.push(e)
					this.onCollisionStart(e)
				}
			}
		})

		for (let i = this.collidingWith.length - 1; i >= 0; i--) {
			if (!isColliding(this.collidingWith[i], this.entity)) {
				this.onCollisionEnd(this.collidingWith[i])
				this.collidingWith.splice(i, 1)
			}
		}
	}
}
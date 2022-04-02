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
	constructor() {
		super()
		this.collidingWith = []
	}

	update(p5, dt) {
		this.entity.area.collidable.forEach(e => {
			if (e !== this.entity && isColliding(e, this.entity)) {
				let index = this.collidingWith.indexOf(e)

				if (index === -1) {
					this.collidingWith.push(e)
					this.entity.handleEvent('collision_started', {
						entity: e
					})

					e.handleEvent('collision_started', {
						entity: this.entity
					})
				}
			}
		})

		for (let i = this.collidingWith.length - 1; i >= 0; i--) {
			let e = this.collidingWith[i]

			if (!isColliding(e, this.entity)) {
				this.collidingWith.splice(i, 1)

				this.entity.handleEvent('collision_ended', {
					entity: e
				})

				e.handleEvent('collision_ended', {
					entity: this.entity
				})
			}
		}
	}
}
import AnimationComponent from '../component/AnimationComponent'
import Entity from './Entity'

export default class Raven extends Entity {
	addComponents() {
		let animation = new AnimationComponent('ravens.png')
		this.addComponent(animation)

		animation.animLength = 8
		animation.animSpeed = 5

		this.width = 32
		this.height = 32
		this.vx = 0
		this.vy = 0
		this.revert = false
	}

	init(p5) {
		super.init(p5)
		this.target = this.area.player
	}

	findTarget() {
		let d = 3200000

		this.area.tagged.get("item").forEach(e => {
			let dd = e.distanceTo(this)

			if (dd < d) {
				d = dd
				this.target = e
			}
		})
	
		this.item = this.target
	}

	update(p5, dt) {
		super.update(p5, dt)

		let target = this.target

		let dx = target.x - this.x - 8
		let dy = target.y - this.y - 8
		let d = Math.sqrt(dx * dx + dy * dy)

		let dd = 0.97

		this.vx *= dd
		this.vy *= dd

		let s = d * 0.1

		if (d < 64 && !this.revert) {
			if (this.target == this.area.player) {
				this.findTarget()
				console.log('searching for target', this.target)
				return
			}

			if (d <= 16) {
				console.log('picked up')
				this.target.owner = this
				this.revert = true
				this.target = this.area.player
			}
		}

		if (this.revert) {
			dx *= -1
			dy *= -1

			if (d >= 300) {
				console.log('dropping')
				this.done = true
				this.item.owner = null
			}
		}

		this.vx += dx / d * s
		this.vy += dy / d * s

		s = d * 0.001

		let m = 20
		this.vx = Math.min(m, Math.max(-m, this.vx))
		this.vy = Math.min(m, Math.max(-m, this.vy))

		this.x += this.vx * s
		this.y += this.vy * s
	}
}
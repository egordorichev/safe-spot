import AnimationComponent from '../component/AnimationComponent'
import InteractableComponent from '../component/InteractableComponent'
import Entity from './Entity'
import Player from './Player'
import Stick from './Stick'
import Lamp from './Lamp'
import Seed from './Seed'

export default class Campfire extends Entity {
	addComponents() {
		let animation = new AnimationComponent('fire.png')
		this.addComponent(animation)

		animation.animSpeed = 5
		animation.animStart = 2

		this.addComponent(new InteractableComponent(this.interact.bind(this)))

		this.time = 0
		this.isLit = false
		this.lr = 1
	}

	light() {
		let animation = this.getComponent('AnimationComponent')

		if (this.isLit || animation.animStart < 3) {
			return
		}

		this.addTag("light")
		this.isLit = true
		this.lightRadius = 1
		this.lr = 1

		animation.layer = 1
		animation.animLength = 13
		animation.animStart = 0
	}

	interact(e) {
		if (e instanceof Player) {
			let item = e.item

			if (item != null && item.done) {
				return false
			}

			if (item instanceof Stick) {
				let component = this.getComponent('AnimationComponent')

				if (this.isLit) { 
					e.dropItem()
					item.done = true

					this.time -= 1
					this.lr = 1

					component.sx = 3
					component.sy = 0
				} else if (component.animStart < 3) {
					component.animStart++

					e.dropItem()
					item.done = true

					component.sx = 3
					component.sy = 0
				}
			} else if (item instanceof Seed) {
				let component = this.getComponent('AnimationComponent')

				if (this.isLit) { 
					e.dropItem()
					item.done = true

					this.time -= 1.5
					this.lr = 1.5

					component.sx = 3
					component.sy = 0
				} else if (component.animStart < 3) {
					component.animStart++

					e.dropItem()
					item.done = true

					component.sx = 3
					component.sy = 0
				}
			} else if (item instanceof Lamp) {
				this.light()
			}

			return true
		}
	}

	putOut() {
		let component = this.getComponent('AnimationComponent')

		this.lr = 0
		this.isLit = false

		component.layer = 0
		component.animStart = 0
		component.animLength = 1

		this.removeTag("light")
	}

	update(p5, dt) {
		super.update(p5, dt)

		this.time += dt * 0.001
		let component = this.getComponent('AnimationComponent')

		let s = dt * 0.01

		component.sx += ((0.9 + Math.sin(this.time) * 0.1) - component.sx) * s
		component.sy += ((0.9 + Math.cos(this.time) * 0.1) - component.sy) * s
		component.angle = Math.cos(this.time * 0.7) * 0.05 

		if (this.isLit) {
			this.lr = Math.max(0, 1 - this.time * 0.005)

			if (this.lr < 0.3) {
				component.layer = 2
				component.animLength = 10
			} else {
				component.layer = 1
				component.animLength = 13
			}
		}

		if (this.isLit && this.lr <= 0) {
			this.putOut()
		}

		if (this.isLit) {
			this.lightRadius = this.lr + Math.cos(this.time) * 0.01
		}
	}

	render(p5, canvas) {
		if (this.isLit) {
			let component = this.getComponent('AnimationComponent')
			let d = (Math.sin(component.time * 0.1) * 5 + 20) * this.lr
			component.position(p5, canvas, 0, 0)

			canvas.translate(0, -4)
			canvas.noStroke()
			canvas.fill(244, 180, 27, 50)
			canvas.circle(0, 0, d * 1.5, d * 1.5)
			canvas.fill(244, 180, 27, 50)
			canvas.circle(0, 0, d, d)
		}

		super.render(p5, canvas)
	}
}
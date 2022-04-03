import Entity from '../entity/Entity'
import PlayerGraphicsComponent from '../component/PlayerGraphicsComponent'
import PlayerInputComponent from '../component/PlayerInputComponent'
import CollisionCheckerComponent from '../component/CollisionCheckerComponent'
import InteractorComponent from '../component/InteractorComponent'
import Tool from './Tool'
import { Howl } from 'howler'

export default class Player extends Entity {
	init(p5) {
		super.init(p5)
		this.item = null

		this.steps = []

		for (let i = 1; i < 16; i++) {
			this.steps[i] = new Howl({ src: [`sfx/steps/${i}.mp3`], volume: 0.2 })
		}

		this.on = new Howl({ src: [`sfx/on.wav`] })
		this.off = new Howl({ src: [`sfx/off.wav`] })
	}
	
	addComponents() {
		this.addComponent(new PlayerGraphicsComponent())
		this.addComponent(new PlayerInputComponent())
		this.addComponent(new CollisionCheckerComponent())
		this.addComponent(new InteractorComponent())
	}	

	update(p5, dt) {
		super.update(p5, dt)

		if (this.item != null && this.item.done) {
			this.item.owner = null
			this.item = null
		}
	}

	pickup(item) {
		if (!this.dropItem()) {
			if (item.done) {
				return
			}

			let component = this.getComponent('PlayerGraphicsComponent')

			this.on.play()

			this.area.chat.print('pickup', item.constructor.name.toLowerCase() + "_name")
		
			item.owner = this

			this.getComponent('InteractorComponent').collidingWith = null
			this.item = item
			this.item.drawOrder = 1

			component.sx = 2
			component.sy = 0
		}
	}

	dropItem() {
		if (this.item == null) {
			return false
		}

		this.off.play()
		this.area.chat.print('drop', this.item.constructor.name.toLowerCase() + "_name")

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

	render(p5, canvas) {
		if (this.item instanceof Tool) {
			canvas.resetMatrix()
			this.area.camera.apply(p5, canvas)

			let x = Math.floor((this.x + 8) / 16) * 16
			let y = Math.floor((this.y) / 16) * 16
			let d = 3 + Math.sin(this.graphicsComponent.time * 2)

			canvas.strokeWeight(1)
			canvas.noFill()
			canvas.stroke(255, 255, 255, 100)
			canvas.rect(x + d, y + d, 16 - d * 2, 16 - d * 2)
		}

		super.render(p5, canvas)
	}
}
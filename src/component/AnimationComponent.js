import GraphicsComponent from './GraphicsComponent'

export default class AnimationComponent extends GraphicsComponent {
	constructor(file) {
		super()

		this.flipped = false
		this.file = file
		this.sx = 1
		this.sy = 1
		this.angle = 0
		this.time = Math.random() * Math.PI * 2
		this.animStart = 0
		this.animLength = 1
		this.animSpeed = 1
		this.layer = 0
		this.oy = 0

		this.id = 'AnimationComponent'
	}

	init(p5) {
		super.init(p5)
		this.sprite = p5.loadImage(this.file)
	}
	
	update(p5, dt) {
		this.time += dt * 0.003
	}

	position(p5, canvas, ox, oy) {
		const scale = this.entity.area.camera.scale

		canvas.resetMatrix()
		canvas.scale(scale)
		
		canvas.translate(
			this.entity.x - this.entity.area.camera.x + p5.windowWidth / scale / 2 + this.entity.width / 2, 
			this.entity.y - this.entity.area.camera.y + p5.windowHeight / scale / 2 + this.entity.height / 2
		)

		canvas.rotate(this.angle)

		let component = this.entity.getComponent('InteractableComponent')

		if (component && component.colliding && component.owner == null && component.colliding.getComponent('InteractorComponent').collidingWith == this.entity) {
			canvas.translate(ox, oy + this.oy)
			canvas.strokeWeight(1)
			canvas.stroke(255)
			canvas.noFill()
			let d = Math.sin(this.time) + 2
			canvas.rect(-this.entity.width / 2 - d, -this.entity.height - d, this.entity.width + d * 2, this.entity.height + d * 2)
			canvas.translate(-ox, -oy - this.oy)

			canvas.noStroke()
			canvas.fill(255)

			canvas.text('[E] or (A)', -2, -this.entity.height - 4)
			canvas.textSize(8)
		}

		canvas.scale(this.sx * (this.flipped ? 1 : -1), this.sy)
		canvas.translate(0, this.oy)
	}

	draw(p5, canvas, ox, oy) {
		if (this.entity.area.glitchBlack && Math.sin(this.time * 0.3) < -0.95) {
			canvas.tint(0)
		}

		if (this.entity.area.glitchFlip && Math.cos(this.time * 0.5) < -0.999) {
			canvas.scale(1, -1)
		}

		if (this.entity.area.glitchRotate && Math.cos(this.time * 0.4) < -0.95) {
			canvas.rotate(Math.PI * 0.5)
		}

		canvas.image(this.sprite, -this.entity.width / 2, -this.entity.height, 
			this.entity.width, this.entity.height, 
			(Math.floor((this.time * this.animSpeed) % this.animLength) + this.animStart) * this.entity.width, 
			this.layer * this.entity.height, this.entity.width, this.entity.height)

		canvas.noTint()
	}

	renderOne(p5, canvas, ox, oy) {
		p5.push()

		this.position(p5, canvas, ox, oy)
		this.draw(p5, canvas, ox, oy)

		p5.pop()
	}

	render(p5, canvas) {
		this.renderOne(p5, canvas, 0, 0)

		return null
	}
}
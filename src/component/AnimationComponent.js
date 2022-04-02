import GraphicsComponent from './GraphicsComponent'

export default class AnimationComponent extends GraphicsComponent {
	constructor(file) {
		super()

		this.flipped = false
		this.file = file
		this.sx = 1
		this.sy = 1
		this.angle = 0
		this.time = 0
		this.animStart = 0
		this.animLength = 1

		this.id = 'AnimationComponent'
	}

	init(p5) {
		super.init(p5)
		this.sprite = p5.loadImage(this.file)
	}
	
	update(p5, dt) {
		this.time += dt * 0.003
	}

	render(p5, canvas) {
		const scale = this.entity.area.camera.scale
		p5.push()

		canvas.resetMatrix()
		canvas.scale(scale)
		
		canvas.translate(
			this.entity.x - this.entity.area.camera.x + p5.windowWidth / scale / 2, 
			this.entity.y - this.entity.area.camera.y + p5.windowHeight / scale / 2
		)

		canvas.rotate(this.angle)
		canvas.scale(this.sx * (this.flipped ? 1 : -1), this.sy)
		canvas.image(this.sprite, -this.entity.width / 2, -this.entity.height, 
			this.entity.width, this.entity.height, 
			(Math.floor((this.time) % this.animLength) + this.animStart) * this.entity.width, 0, this.entity.width, this.entity.height)

		p5.pop()

		return null
	}
}
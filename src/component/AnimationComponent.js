import GraphicsComponent from './GraphicsComponent'

export default class AnimationComponent extends GraphicsComponent {
	constructor(file) {
		super()

		this.flipped = false
		this.file = file
		this.sx = 1
		this.sy = 1
		this.angle = 0

		this.id = 'AnimationComponent'
	}

	init(p5) {
		super.init(p5)
		this.sprite = p5.loadImage(this.file)
	}

	render(p5) {
		const scale = this.entity.area.camera.scale
		p5.push()

		p5.resetMatrix()
		p5.scale(scale)
		
		p5.translate(
			this.entity.x - this.entity.area.camera.x + p5.windowWidth / scale / 2, 
			this.entity.y - this.entity.area.camera.y + p5.windowHeight / scale / 2
		)

		p5.rotate(this.angle)
		p5.scale(this.sx * (this.flipped ? 1 : -1), this.sy)
		p5.image(this.sprite, -this.entity.width / 2, -this.entity.height / 2) // , 8, 8, (Math.floor((this.time * 10) % anim.len) + anim.start) * 8, 0, 8, 8);

		p5.pop()

		return null
	}
}
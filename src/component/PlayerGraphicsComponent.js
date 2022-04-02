import GraphicsComponent from './GraphicsComponent'

export default class PlayerGraphicsComponent extends GraphicsComponent {
	render(p5) {
		p5.stroke(0)
		p5.fill(255, 0, 0)
		p5.rect(this.entity.x, this.entity.y, this.entity.width, this.entity.height)
	}
}
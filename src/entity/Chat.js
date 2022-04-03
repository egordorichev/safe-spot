import Entity from './Entity'
const locale = require('../ru')

export default class Chat extends Entity {
	constructor() {
		super()

		this.lines = []
	}

	print(text) {
		this.lines.push([ locale[text], 10 ])
	}

	renderUi(p5, canvas) {
		canvas.textAlign(p5.LEFT, p5.BOTTOM)

		p5.fill(255)
		p5.noStroke()
		p5.strokeWeight(100)
		p5.textSize(24)

		let j = 0

		for (let i = this.lines.length - 1; i >= 0; i--) {
			let line = this.lines[i]

			p5.fill(255, 255, 255, line[1] * 255)

			p5.text(line[0], -p5.windowWidth / 2 + 10, p5.windowHeight / 2 - 10 - j * 32)

			j += line[0].split(/\r\n|\r|\n/).length

			if (line[1] <= 0) {
				this.lines.splice(i, 1)
			}
		}
	}

	update(p5, dt) {
		super.update(p5, dt)

		this.lines.forEach(line => {
			line[1] -= dt * 0.001
		})
	}
}
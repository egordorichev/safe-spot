import React from 'react'
import Sketch from 'react-p5'
import Area from './Area'
import Camera from './entity/Camera'
import Item from './entity/Item'
import Player from './entity/Player'

export default class App extends React.Component {
	setup(p5, ref) {
		this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL)
		this.canvas.parent(ref)

		let context = this.canvas.elt.getContext('webgl')
		
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		this.area = new Area(p5)

		this.area.add(this.player = new Player())
		this.area.add(this.camera = new Camera(this.player))

		for (let i = 0; i < 32; i++) {
			var item = new Item()
			
			item.x = Math.random() * 128 - 64
			item.y = Math.random() * 128 - 64

			this.area.add(item)
		}
	}

	preload(p5) {
		this.shader = p5.loadShader('main.vert', 'main.frag')
		this.gameCanvas = p5.createGraphics(p5.windowWidth, p5.windowHeight)

		let context = this.gameCanvas.elt.getContext('2d')
		
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
	}

	destroy() {
		this.area.destroy()
	}

	draw(p5) {
		this.area.update(p5, p5.deltaTime)

		this.gameCanvas.background(0)

		this.gameCanvas.resetMatrix()
		this.camera.apply(p5, this.gameCanvas)
		this.camera.renderGrid(p5, this.gameCanvas)

		this.area.render(p5, this.gameCanvas)

		this.canvas.background(0)

		p5.shader(this.shader)
		this.shader.setUniform('tex0', this.gameCanvas)
		p5.rect(0, 0, p5.width, p5.height)
	}

	windowResized(p5) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
	}

	render() {
		return (
			<div className="App">
				<Sketch 
					setup={this.setup.bind(this)} 
					preload={this.preload.bind(this)}
					draw={this.draw.bind(this)}
					windowResized={this.windowResized.bind(this)}
				/>
			</div>
		)
	}
}
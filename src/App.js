import React from 'react'
import Sketch from 'react-p5'
import Area from './Area'
import Camera from './entity/Camera'
import Item from './entity/Item'
import Player from './entity/Player'
import Tile from './entity/Tile'
import Campfire from './entity/Campfire'

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

		let campfire = new Campfire()
		campfire.x = 64
		campfire.y = 64
		this.area.add(campfire)

		for (let x = -16; x < 16; x++) {
			for (let y = -16; y < 16; y++) {
				let d = Math.sqrt(x * x + y * y)

				if (d > 8 && Math.random() * 16 < d) {
					continue
				}

				var item = new Tile()
				
				item.x = x * 16
				item.y = y * 16

				this.area.add(item)
			}
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
		this.shader.setUniform('size', [ p5.windowWidth, p5.windowHeight ])

		let x = 64
		let y = 64

		this.shader.setUniform('light1', [ 
			0.5 + (x - this.camera.x) / p5.windowWidth * this.camera.scale, 
			0.5 + (y - this.camera.y) / p5.windowHeight * this.camera.scale
		])

		this.shader.setUniform('light0', [ 
			0.5 + (this.player.x - this.camera.x) / p5.windowWidth * this.camera.scale, 
			0.5 + (this.player.y - this.camera.y) / p5.windowHeight * this.camera.scale
		])

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
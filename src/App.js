import React from 'react'
import Sketch from 'react-p5'
import Area from './Area'
import Camera from './entity/Camera'
import Item from './entity/Item'
import Player from './entity/Player'

export default class App extends React.Component {
	setup(p5, ref) {
		this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight)
		this.canvas.parent(ref)

		let context = this.canvas.elt.getContext('2d')
		
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		this.area = new Area(p5)

		this.area.add(this.player = new Player())
		this.area.add(this.camera = new Camera(this.player))

		var item = new Item()
		
		item.x = 32
		item.y = 8

		this.area.add(item)
	}

	destroy() {
		this.area.destroy()
	}

	draw(p5) {
		this.area.update(p5, p5.deltaTime)

		p5.background(0)

		this.camera.apply(p5)
		this.camera.renderGrid(p5)

		this.area.render(p5)
	}

	windowResized(p5) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
	}

	render() {
		return (
			<div className="App">
				<Sketch 
					setup={this.setup.bind(this)} 
					draw={this.draw.bind(this)}
					windowResized={this.windowResized.bind(this)}
				/>
			</div>
		)
	}
}
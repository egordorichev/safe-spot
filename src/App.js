import React from 'react'
import Sketch from 'react-p5'

export default class App extends React.Component {
	setup(p5, ref) {
		this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight)
		this.canvas.parent(ref)
	}

	draw(p5) {
		p5.background(0)
		p5.ellipse(70, 70, 70, 70)
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
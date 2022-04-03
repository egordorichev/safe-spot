import React from 'react'
import Sketch from 'react-p5'
import Area from './Area'
import Camera from './entity/Camera'
import Shovel from './entity/Shovel'
import Stick from './entity/Stick'
import Player from './entity/Player'
import Lamp from './entity/Lamp'
import Plant from './entity/Plant'
import WateringCan from './entity/WateringCan'
import Map from './entity/Map'
import Raven from './entity/Raven'

export default class App extends React.Component {
	setup(p5, ref) {
		this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL)
		this.canvas.parent(ref)
		this.ref = ref

		let context = this.canvas.elt.getContext('webgl')
		
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		this.area = new Area(p5)
		this.time = 0

		this.area.add(this.player = new Player())
		this.area.add(this.camera = new Camera(this.player))

		this.area.player = this.player

		let lamp = new Lamp()
		lamp.y = 24
		this.area.add(lamp)

		let shovel = new Shovel()
		shovel.x = 24
		this.area.add(shovel)

		let wateringCan = new WateringCan()
		wateringCan.x = 16
		wateringCan.y = -16
		this.area.add(wateringCan)

		let map = new Map()
		this.area.add(map)
		this.area.map = map
		this.gameOver = false
		this.menu = false

		for (let x = -8; x < 8; x++) {
			for (let y = -8; y < 8; y++) {
				let d = Math.sqrt(x * x + y * y)

				if (d > 4 && Math.random() * 8 < d) {
					continue
				}

				map.setTile(x, y, Math.random() < 0.08 ? 7 : ~~(Math.random() * 6) + 1)

				if (d > 1 && Math.random() < 0.02 * d) {
					let item = new Plant()

					item.x = x * 16
					item.y = y * 16
					
					this.area.add(item)
				}
			}
		}

		for (let i = 0; i < 8; i++) {
			let item = new Stick()

			item.x = Math.random() * 512 - 256
			item.y = Math.random() * 512 - 256
			
			this.area.add(item)
		}

		this.resetRavenTimer()
	}

	resetRavenTimer() {
		this.ravenTimer = Math.random() * 32 + 32
	}

	preload(p5) {
		this.shader = p5.loadShader('main.vert', 'main.frag')
		this.gameCanvas = p5.createGraphics(p5.windowWidth, p5.windowHeight)

		let context = this.gameCanvas.elt.getContext('2d')
		
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		this.font = p5.loadFont('font.ttf')
	}

	destroy() {
		this.area.destroy()
	}

	draw(p5) {
		if (this.gameOver) {
			this.drawGameOver(p5)
		} else if (this.menu) {
			this.drawMenu(p5)
		} else {
			this.drawGame(p5)
		}

		this.canvas.background(0)

		p5.shader(this.shader)

		this.shader.setUniform('time', this.time)
		this.shader.setUniform('tex0', this.gameCanvas)
		this.shader.setUniform('size', [ p5.windowWidth, p5.windowHeight ])

		let light = this.area.tagged.get('light')

		light.sort((a, b) => a.distanceToCamera() > b.distanceToCamera() ? -1 : 1)

		for (let i = 0; i < 8; i++) {
			let e = light[i]
			let x = -128
			let y = -128

			if (e) {
				x = e.x + e.width / 2
				y = e.y + e.height / 2
			}

			this.shader.setUniform('light' + i, [ 
				0.5 + (x - this.camera.x) / p5.windowWidth * this.camera.scale, 
				0.5 + (y - this.camera.y) / p5.windowHeight * this.camera.scale,
				e ? 1 / e.lightRadius : 100
			])
		}

		p5.rect(0, 0, p5.width, p5.height)
	}

	drawMenu(p5) {
		this.gameCanvas.background(0)

		this.gameCanvas.resetMatrix()
		this.gameCanvas.textAlign(p5.CENTER)
		
		this.gameCanvas.noStroke()
		this.gameCanvas.fill(255, 0, 0)
		this.gameCanvas.textSize(128)
		this.gameCanvas.textFont(this.font)
		this.gameCanvas.text('SAFE SPOT', p5.windowWidth / 2, p5.windowHeight / 2)
		this.gameCanvas.fill(255)
		this.gameCanvas.textSize(32)
		this.gameCanvas.text('Press X to start', p5.windowWidth / 2, p5.windowHeight / 2 + 64)

		if (p5.keyIsDown(88)) {
			this.menu = false
			this.gameOver = false
		}
	}

	drawGameOver(p5) {
		p5.shader(this.shader)
		this.shader.setUniform('enabled', 0)

		this.gameCanvas.background(0)

		this.gameCanvas.resetMatrix()
		this.gameCanvas.textAlign(p5.CENTER)
		
		this.gameCanvas.noStroke()
		this.gameCanvas.fill(255, 0, 0)
		this.gameCanvas.textSize(128)
		this.gameCanvas.textFont(this.font)
		this.gameCanvas.text('YOU DIED', p5.windowWidth / 2, p5.windowHeight / 2)
		this.gameCanvas.fill(255)
		this.gameCanvas.textSize(32)
		this.gameCanvas.text('Press F to continue', p5.windowWidth / 2, p5.windowHeight / 2 + 64)

		if (p5.keyIsDown(70)) {
			this.menu = true
			this.gameOver = false

			window.location.reload()
		}
	}

	drawGame(p5) {
		p5.shader(this.shader)
		this.shader.setUniform('enabled', 1)

		this.time += p5.deltaTime * 0.01
		this.ravenTimer -= p5.deltaTime * 0.003

		if (this.ravenTimer <= 0) {
			this.resetRavenTimer()
			console.log('spawn raven')
			let a = Math.random() * Math.PI * 2
			let d = 400

			let raven = new Raven()
			raven.x = this.player.x + Math.cos(a) * d
			raven.y = this.player.y + Math.sin(a) * d
			this.area.add(raven)
		}

		this.area.update(p5, p5.deltaTime)

		this.gameCanvas.background(0)

		this.gameCanvas.resetMatrix()
		this.camera.apply(p5, this.gameCanvas)
		this.camera.renderGrid(p5, this.gameCanvas)

		this.area.render(p5, this.gameCanvas)

		if (this.area.tagged.get('light').length == 0) {
			console.log('game over')
			this.gameOver = true
		}

		let d = 3200000

		this.area.tagged.get('light').forEach(e => {
			let dd = e.distanceTo(this.player)
			d = Math.min(dd, d)
		})

		if (d > 350) {
			console.log('game over')
			this.gameOver = true
		}
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
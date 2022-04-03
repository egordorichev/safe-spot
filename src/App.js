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
import Memory from './entity/Memory'
import Chat from './entity/Chat'
import Firefly from './entity/Firefly'
import PlayerInputComponent from './component/PlayerInputComponent'

import { Howl } from 'howler'

export default class App extends React.Component {
	unlockAudioContext(context) {
		let menuMusic = this.menuMusic
		let self = this
    if (context.state !== "suspended") return;
    const b = document.body;
    const events = ["touchstart", "touchend", "mousedown", "keydown"];
    events.forEach(e => b.addEventListener(e, unlock, false));
    function unlock() {context.resume().then(clean); menuMusic.play(); self.currentMusic = menuMusic; console.log(self.currentMusic) }
    function clean() {events.forEach(e => b.removeEventListener(e, unlock));}
	}

	setup(p5, ref) {
		this.unlockAudioContext(new (window.AudioContext || window.webkitAudioContext)())

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
		this.area.glitchBlack = false

		this.area.add(this.player = new Player())
		this.area.add(this.camera = new Camera(this.player))
		this.area.add(this.area.chat = new Chat())

		this.area.player = this.player

		let lamp = new Lamp()
		lamp.y = 24
		this.area.add(lamp)

		let shovel = new Shovel()
		shovel.x = 24
		this.area.add(shovel)

		let memory = new Memory("memory_zakolka")
		memory.x = -24
		this.area.add(memory)

		for (let i = 0; i < 32; i++) {
			let firefly = new Firefly()
			firefly.x = Math.random() * 512 - 256
			firefly.y = Math.random() * 512 - 256
			this.area.add(firefly)
		}

		let wateringCan = new WateringCan()
		wateringCan.x = 16
		wateringCan.y = -16
		this.area.add(wateringCan)

		let map = new Map()
		this.area.add(map)
		this.area.map = map
		this.gameOver = false
		this.menu = true

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
		this.controllers = []
		let self = this

		window.addEventListener("gamepadconnected", function(e) {
			self.gamepadHandler(e, true);
			console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
				e.gamepad.index, e.gamepad.id,
				e.gamepad.buttons.length, e.gamepad.axes.length);      
		});
		window.addEventListener("gamepaddisconnected", function(e) {
			console.log("Gamepad disconnected from index %d: %s",
				e.gamepad.index, e.gamepad.id);      
				self.gamepadHandler(e, false);
		});   
	}

	gamepadHandler(event, connecting) {
		let gamepad = event.gamepad
		if (connecting) {
			this.controllers[gamepad.index] = gamepad
			this.player.getComponent('PlayerInputComponent').controller = gamepad
		} else {
			delete this.controllers[gamepad.index]
		}
	}

	resetRavenTimer() {
		this.ravenTimer = Math.random() * 64 + 64
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
		this.fontBold = p5.loadFont('fontbold.ttf')
	
		this.menuMusic = new Howl({ volume: 0.3, src: ['menu.wav'], loop: true })
		this.deathMusic = new Howl({ volume: 0.3, src: ['death.wav'], loop: false })

		this.ravenMusic = new Howl({ volume: 0.3, src: ['ravens.wav'], onend: () => {
			if (!this.nextMusic) {
				this.nextMusic = this.commonMusic
			}

			this.nextMusic.play()
			this.nextMusic = null
			this.currentMusic = this.nextMusic
		}})

		this.dangerMusic = new Howl({ volume: 0.3, src: ['danger.wav'], onend: () => {
			if (!this.nextMusic) {
				this.nextMusic = this.commonMusic
			}

			this.nextMusic.play()
			this.nextMusic = null
			this.currentMusic = this.nextMusic
		}})

		this.commonMusic = new Howl({ volume: 0.3, src: ['common.wav'], onend: () => {
			if (!this.nextMusic) {
				this.nextMusic = this.commonMusic
			}

			if (this.nextMusic == this.commonMusic) {
				let delay = (Math.random() * 32 + 10) * 1000
				console.log('delay', delay)

				setTimeout(() => {
					if (this.gameOver || this.menu) {
						return
					}

					this.nextMusic = Math.random() < 0.5 ? this.nextMusic : this.bassDrumMusic
					this.nextMusic.play()
					this.nextMusic = null
				}, delay)
			} else {
				this.nextMusic.play()
				this.nextMusic = null
			}

			this.currentMusic = this.nextMusic
		}})

		this.bassDrumMusic = new Howl({ volume: 0.3, src: ['bass_drum.wav'], onend: () => {
			setTimeout(() => {
				if (this.gameOver || this.menu) {
					return
				}
				
				this.commonMusic.play()
				this.currentMusic = this.commonMusic
			}, 5000)
		}})

		this.bassMusic = new Howl({ volume: 0.3, src: ['bass.wav'], onend: () => {
			setTimeout(() => {
				if (this.gameOver || this.menu) {
					return
				}

				this.bassDrumMusic.play()
				this.currentMusic = this.bassDrumMusic
			}, 5000)
		}})

		this.beginningMusic = new Howl({ volume: 0.3, src: ['beginning.wav'], onend: () => {
			setTimeout(() => {
				this.bassMusic.play()
				this.currentMusic = this.bassMusic
			}, 5000)
		}})

		this.spookLevel = 0
		this.spookySounds = []
		this.resetSpookyTimer()
		
		for (let i = 1; i < 10; i++) {
			if (i == 3) {
				continue
			}

			this.spookySounds.push(new Howl({ src: [`sfx/SF${i}.wav`] }))
		}

		this.shreekSounds = []
		
		for (let i = 1; i < 4; i++) {
			this.shreekSounds.push(new Howl({ src: [`sfx/Shriek${i}.wav`], volume: 0.5 }))
		}
	}

	resetSpookyTimer() {
		this.spookyTimer = Math.random() * 32 + 32
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

		const gl = this.canvas.elt.getContext('webgl')
		gl.disable(gl.DEPTH_TEST)
		
		p5.textFont(this.fontBold)
		this.area.chat.renderUi(p5, p5)
	}

	drawMenu(p5) {
		this.gameCanvas.background(0)

		this.gameCanvas.resetMatrix()
		this.gameCanvas.textAlign(p5.CENTER)
		
		this.gameCanvas.noStroke()
		this.gameCanvas.fill(255, 0, 0)
		this.gameCanvas.textSize(128)
		this.gameCanvas.textFont(this.font)
		this.gameCanvas.text('SAFE SPOT', p5.windowWidth / 2 + Math.random() * 4 - 2, p5.windowHeight / 2 + Math.random() * 4 - 2)
		this.gameCanvas.fill(255)
		this.gameCanvas.textSize(32)
		this.gameCanvas.text('Press X to start', p5.windowWidth / 2, p5.windowHeight / 2 + 64)

		if (p5.keyIsDown(88) || p5.keyIsDown(32) || PlayerInputComponent.controllerPressed(2) || PlayerInputComponent.controllerPressed(0)) {
			this.menu = false
			this.gameOver = false

			this.menuMusic?.stop();
			this.beginningMusic.play();
			this.currentMusic = this.beginningMusic
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

		if (p5.keyIsDown(70) || PlayerInputComponent.controllerPressed(0) || PlayerInputComponent.controllerPressed(2)) {
			this.menu = true
			this.gameOver = false

			window.location.reload()
		}
	}

	drawGame(p5) {
		p5.shader(this.shader)
		this.shader.setUniform('enabled', (!this.area.glitchFlash || Math.cos(this.time * 0.1) > -0.99)/* && this.time > 10 && (this.time < 15 || this.time > 20)*/)

		this.time += p5.deltaTime * 0.01

		if (this.time > 5000) {
			this.area.glitchRotate = true
		}

		if (this.time > 4000) {
			this.area.camera.shake = true
		}
		
		if (this.time > 3000) {
			this.area.glitchFlip = true
		} 
		
		if (this.time > 2000) {
			this.area.glitchBlack = true
		} 
		
		if (this.time > 1000) {
			this.area.glitchFlash = true
		}

		this.ravenTimer -= p5.deltaTime * 0.001

		if (this.ravenTimer <= 0) {
			this.resetRavenTimer()
			console.log('spawn raven')
			let a = Math.random() * Math.PI * 2
			let d = 400

			let raven = new Raven(() => {
				// this.nextMusic = this.dangerMusic
			})

			raven.x = this.player.x + Math.cos(a) * d
			raven.y = this.player.y + Math.sin(a) * d
			this.area.add(raven)

			/*this.currentMusic?.stop()
			this.ravenMusic.play()
			this.currentMusic = this.ravenMusic*/
		}

		this.spookyTimer -= p5.deltaTime * 0.003

		if (this.spookyTimer <= 0) {
			console.log('spook')
			this.resetSpookyTimer()
			this.spookySounds[~~(Math.random() * 8)].play()

			if (Math.random() < 0.5) {
				this.spookLevel = Math.min(7, this.spookLevel + 1)

				let choices = [
					[ 'wife', 8 ],
					[ 'kid', 7 ],
					[ 'parents', 5 ],
					[ 'friends', 5 ],
					[ 'author', 6 ],
					[ 'colleague', 6 ],
					[ 'pet', 6 ]
				]

				this.shreekSounds[~~(Math.random() * 3)].play()
				let choice = choices[~~(Math.random() * choices.length)]
				this.area.chat.print(`${choice[0]}_${Math.min(choice[1] - 1, this.spookLevel)}`)
			}
		}

		this.area.update(p5, p5.deltaTime)

		this.gameCanvas.background(0)

		this.gameCanvas.resetMatrix()
		this.camera.apply(p5, this.gameCanvas)
		this.camera.renderGrid(p5, this.gameCanvas)

		this.area.render(p5, this.gameCanvas)

		if (this.area.tagged.get('light').length == 0) {
			this.fail()
		}

		let d = 3200000

		this.area.tagged.get('light').forEach(e => {
			let dd = e.distanceTo(this.player)
			d = Math.min(dd, d)
		})

		if (d > 350) {
			this.fail()
		}
	}

	fail() {
		console.log('game over')
		this.gameOver = true

		console.log(this.currentMusic)
		this.currentMusic?.stop()
		this.currentMusic = this.deathMusic
		this.deathMusic.play()
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
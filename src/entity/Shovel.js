import Tool from './Tool'

export default class Shovel extends Tool {
	addComponents() {
		super.addComponents()

		let component = this.getComponent('AnimationComponent')
		component.layer = 5
		component.animSpeed = 5

		this.beingUsed = false
	}

	use() {
		if (this.beingUsed) {
			return
		}

		this.beingUsed = true
		let component = this.getComponent('AnimationComponent')

		component.animStart = 1
		component.animLength = 9 
		component.time = 0

		setTimeout(() => {
			component.animStart = 0
			component.animLength = 1

			this.beingUsed = false

			let x = Math.floor((this.owner.x + 8) / 16)
			let y = Math.floor((this.owner.y) / 16)
			let tile = this.area.map.getTile(x, y)

			if (tile == 7) {
				this.area.map.setTile(x, y, 8)
			} else {
				this.area.map.setTile(x, y, tile == 0 ? (~~(Math.random() * 7) + 1) : 0)
			}
		}, 2000)
	}
}
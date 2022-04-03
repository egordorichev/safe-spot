import Item from './Item'

export default class Shovel extends Item {
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

			let x = ~~((this.owner.x + 8) / 16)
			let y = ~~((this.owner.y + 8) / 16)

			this.area.map.setTile(x, y, this.area.map.getTile(x, y) == 0 ? (~~(Math.random() * 6) + 1) : 0)
		}, 2000)
	}
}
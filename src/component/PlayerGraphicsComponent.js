import AnimationComponent from './AnimationComponent'

export default class PlayerGraphicsComponent extends AnimationComponent {
	constructor() {
		super('pc.png')
		this.id = 'PlayerGraphicsComponent'
	}
}
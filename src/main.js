var UiCorePlugin = require('ui_core_plugin')
var JST = require('.././jst')
var Styler = require('./styler')
var version = require('../package.json').version
var Events = Clappr.Events

class Channels extends UiCorePlugin {
	
	static get version() { return version }

	get name() { return 'channels' }
	get template() { return JST.channels }

	get attributes() {
		return {
			'class': 'player-channels',
			'data-channels': ''
		}
	}

	get events() {
		return {
			'click [data-channel-choice] a': 'channelClicked'
		}
	}

	constructor(core) {
		this.core = core
		this.channels = core.options.channels || []
		super(core)
	}

	channelClicked(channelLink) {
		//Get the channel clicked
		var channel = this.channels[channelLink.currentTarget.getAttribute('data-id')]

		//Loading the new source
		this.core.load(channel.source)

		//Current container
		this.container = this.core.getCurrentContainer();

		//Update poster if exists
		if(channel.poster && this.container.hasPlugin('poster')) {
			this.container.getPlugin('poster').load(channel.poster)
		}

		//When ready, trigger play
		this.container.on(Events.CONTAINER_READY, this.container.play)
	}

	render() {
		this.$el.html(this.template({'channels':this.channels}))
		var style = Styler.getStyleFor(this.name)
		this.$el.append(style)
		this.core.$el.append(this.el)

		return this
	}
}

module.exports = window.Channels = Channels
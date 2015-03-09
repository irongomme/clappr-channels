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
		this.channels = this.core.channels || []
		super(core)
	}

	channelClicked(channelLink) {
		//Get the channel clicked
		var channel = this.channels[channelLink.currentTarget.getAttribute('data-id')]
		//Loading the new source
		this.core.load(channel.source)
	}

	render() {
		this.$el.html(this.template({'channels':this.channels}))
		var style = Styler.getStyleFor(this.name)
		this.$el.append(style)
		this.core.container.$el.append(this.el)

		return this
	}
}

module.exports = window.Channels = Channels
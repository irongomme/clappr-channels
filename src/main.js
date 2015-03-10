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
		this.keepVisible = false
		super(core)
	}

	bindEvents() {
		this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_SHOW, this.show)
		this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_HIDE, this.hide)
	}

	channelClicked(channelLink) {
		//Get the channel clicked
		var channelId = channelLink.currentTarget.getAttribute('data-id')
		var channel = this.channels[channelId]

		//Put old channel into the list
		this.channels[channelId] = {
			source: this.core.options.source,
			poster: this.core.options.poster
		}

		//Loading the new source
		this.core.load(channel.source)
		this.container = this.core.getCurrentContainer();

		//Update poster if exists
		if(channel.poster && this.container.hasPlugin('poster')) {
			this.container.getPlugin('poster').load(channel.poster)
		}

		//When ready, trigger play
		this.container.on(Events.CONTAINER_READY, this.container.play)

		this.render()
	}

	isVisible() {
		return !this.$el.hasClass('channels-hide')
	}

	show(event) {
		var timeout = 2500
		clearTimeout(this.hideId)
		this.$el.show()
		this.$el.removeClass('channels-hide')
		this.hideId = setTimeout(() => this.hide(), timeout)
	}

	hide() {
		var timeout = 2500
		clearTimeout(this.hideId)
		if (!this.isVisible()) return
		if (this.keepVisible) {
			this.hideId = setTimeout(() => this.hide(), timeout)
		} else {
			this.$el.addClass('channels-hide')
		}
	}

	render() {
		var style = Styler.getStyleFor(this.name, {
			baseUrl: this.core.options.baseUrl
		})
		
		this.$el.html(this.template({
			channels: this.channels
		}))
		this.$el.append(style)
		this.core.$el.append(this.el)
		this.hide()
		
		return this
	}
}

module.exports = window.Channels = Channels
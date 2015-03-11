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
			'click [data-channel-link]:not(.active)': 'channelClicked'
		}
	}

	constructor(core) {
		this.core = core
		this.channels = core.options.channels || []
		this.keepVisible = false
		this.assignCurrentChannel()
		super(core)
	}

	bindEvents() {
		this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_SHOW, this.show)
		this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_HIDE, this.hide)
	}

	channelClicked(e) {
		console.log(e)

		var channel = e.target.dataset

		//Loading the new source
		this.core.load(channel.source)
		this.container = this.core.getCurrentContainer();

		//Update poster if exists
		if(channel.poster && this.container.hasPlugin('poster')) {
			this.container.getPlugin('poster').load(channel.poster)
		}

		//When ready, trigger play
		this.container.on(Events.CONTAINER_READY, this.container.play)

		this.assignCurrentChannel(channel.source)
		this.render()
	}

	assignCurrentChannel(source) {
		var currentSource = source || this.core.options.source 
		for(var i in this.channels) {
			this.channels[i].current = (this.channels[i].source == currentSource)
		}
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

		this.$el.html(this.template())
		this.$el.append(style)
		this.core.$el.append(this.el)

		for(var i in this.channels) {
			var channelLinkEl = $('<a href="#" data-channel-link></a>')
			channelLinkEl.attr('data-name', this.channels[i].name)
			channelLinkEl.attr('data-source', this.channels[i].source)
			channelLinkEl.attr('data-poster', this.channels[i].poster)

			var channelEl = $('<li data-channel-choice></li>')
			if(this.channels[i].poster) {
				channelLinkEl.css({'background-image': 'url('+this.channels[i].poster+'?t='+Math.floor(Date.now() / 1000)+')'})
			}
			channelEl.append(channelLinkEl)
			this.core.$el.find('[data-channels-list]').append(channelEl)
			if(this.channels[i].current) {
				channelLinkEl.addClass('active')
				channelLinkEl.css({'font-size': Math.floor(channelEl.height() * 0.5)})
			}
		}

		this.hide()
		
		return this
	}
}

module.exports = window.Channels = Channels
# Clappr Channels Plugin

<img src="https://raw.githubusercontent.com/irongomme/clappr-channels/master/screenshot.png"/>

## Description

This plugin aims to offer a way to switch between several video sources inside the player screen, live TV Channels for example

## Usage

Add both Clappr and Channel plugin scripts to your HTML:

```html
<head>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
  <script type="text/javascript" src="dist/channels.js"></script>
</head>
```

Then just add `Channels` into the list of plugins of your player instance, and array of sources to add swtiching between them:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.m3u8",
  plugins: {
    'core': [Channels]
  },
  channels: [
  	{
  		source: http://mystream.com/stream1/index.m3u8,
  		poster: http://mystream.com/poster1.png,
  		name: 'Stream 1'
  	},
  	{
  		source: http://mystream.com/stream2/index.m3u8,
  		poster: http://mystream.com/poster2.png,
  		name: 'Stream 2'
  	},
  	etc ...
  ]
});
```

## Options

Additionnal features are available : 

##### channelsFullscreenOnly

Adding `channelsFullscreenOnly = true` make the channels visible only in fullscreen mode

##### channelsPosterRefresh

Adding `channelsPosterRefresh = 60000` (in ms) make the poster of each channel to refreshed if image change periodically
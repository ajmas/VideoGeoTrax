var videoView = {

	metadataTrackId: 'metadataTrack',
	videoId: 'myVideo',
	geoTracks: undefined,
	metadataTrack: undefined,
	callbacks: [],
	
    init: function () {
        
    },
    
    setGeoTracks: function(geoTracks) {
        this.geoTracks = geoTracks;
		this.metadataTrack = this.addGeojsonToVideo (this.videoId, this.metadataTrackId, geoTracks);
		
		var metadataTrack = this.metadataTrack;
		var scope = this;
		
		metadataTrack.addEventListener("cuechange", function () {
			var myCues = metadataTrack.activeCues;  // activeCues is an array of current cues.                                                    
			if (myCues.length > 0) {		
				try {
					var obj = JSON.parse(myCues[0].text);		
					scope.fireCoodinateChangeEvent(
						metadataTrack,
						obj.geometry.coordinates,
						obj.idx // update this to be an index
						);
			    } catch (e) {
			    	scope.fireCoodinateChangeEvent(
						metadataTrack,
						undefined,
						-1
						);
			    }			
			}
		});	
		
	},
	
	setVideo: function (url) {
		// todo
	},
	
    setCurrentTrackIdx: function(idx) {
    
        // change video position, according to idx
        var i=0;
        var cues = metadataTrack.cues;
        if (idx < cues.length) {
//        	video.setTime(cues[idx].start);
        }
    },

	addGeojsonToVideo: function (videoId, newTrackId, geojson)  {
		var points = geojson.features[0].geometry.coordinates;
		var times  = geojson.features[0].properties.coordTimes;

		var video = document.getElementById(videoId), track, i; 
	
		track = video.addTextTrack("metadata", "coordinates", "xx"); 
		track.mode = 'showing';
		$(track).attr('id', newTrackId);
			
		var coordsLLET = [];
	
		for (i=0; i<points.length; i++) {
			coordsLLET.push(	       
			   [points[i][0], points[i][1], points[i][2], Date.parse(times[i])]
			   );
		}
		
		for (i=1; i<coordsLLET.length; i++) {
			var start, end, coord;
		
			//console.log('zzzz');
			var jsonObj = { 
			    "idx": i, 
				"geometry":{ 
					"type":"Point", 
					"coordinates":[ coordsLLET[i][0] , coordsLLET[i][1], coordsLLET[i][2], coordsLLET[i][3], ]
					}
				};

			track.addCue(new VTTCue(
				(coordsLLET[i-1][3] - coordsLLET[0][3]) / 1000, 
				(coordsLLET[i][3] - coordsLLET[0][3]) / 1000,
				JSON.stringify(jsonObj)
				));
			
		}

		return track;
	},
	
	registerCoodinateChangeCallback: function (callback) {
		this.callbacks.push(callback);	
	},
	
	unregisterCoodinateChangeCallback: function (callback) {
		// todo
	},
	
	fireCoodinateChangeEvent: function (coordinate, geoTracks, idx) {
		var i=0; 
		for (i=0; i<this.callbacks.length; i++) {
			try {
				this.callbacks[i](coordinate, geoTracks, idx);
			} catch (e) {
				console.error(e);
			}
		}
	}

};
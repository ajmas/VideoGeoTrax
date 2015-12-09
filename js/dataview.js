var dataView = {

    displayMode: 'frameRoute',
    geoTracks: {},
    map: undefined,
	showMarker: false,
	showRoute: false,
	
    init: function() {
		var coordinatesField = document.getElementById("coordinates");
		var elevationField = document.getElementById("elevation");
		var datetimeField = document.getElementById("datetime");
		coordinatesField.innerText = 'n/a';
		elevationField.innerText = 'n/a';
		datetimeField.innerText = 'n/a';
    },


    setGeoTracks: function(geoTracks) {
        this.geoTracks = geoTracks;
    },

    setCurrentTrackIdx: function(idx) {
        var coords = this.geoTracks.features[0].geometry.coordinates[idx];
	    var time = this.geoTracks.features[0].properties.coordTimes[idx];
		time = new Date(Date.parse(time)).toUTCString();
		
		var coordinatesField = document.getElementById("coordinates");
		var elevationField = document.getElementById("elevation");
		var datetimeField = document.getElementById("datetime");
		coordinatesField.innerText = coords[0] + ', ' + coords[1];
		elevationField.innerText = coords[2] + ' metres';
		datetimeField.innerText = time;
    },

    registerCoodinateChangeCallback: function(callback) {

    },

    fireCoodinateChangeEvent: function(coordinate) {

    },

    centerMap: function(coords) {
        this.map.getView().setCenter(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'));
    }
};

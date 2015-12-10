/* jshint strict: false */

var dataView = {

    geoTracks: undefined,

    init: function () {
        var coordinatesField, elevationField, datetimeField;
        coordinatesField = document.getElementById("coordinates");
        elevationField = document.getElementById("elevation");
        datetimeField = document.getElementById("datetime");
        coordinatesField.innerText = 'n/a';
        elevationField.innerText = 'n/a';
        datetimeField.innerText = 'n/a';
    },


    setGeoTracks: function (geoTracks) {
        this.geoTracks = geoTracks;
    },

    setCurrentTrackIdx: function (idx) {
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

    registerCoodinateChangeCallback: function (callback) {
        // TODO
    }
};
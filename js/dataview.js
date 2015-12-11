/* jshint strict: false */

var dataView = {

    geoTracks: undefined,
    countryOutlines: undefined,
    countryOutlinesUrl: 'media/countries.geojson',
    
    init: function () {
        var coordinatesField, elevationField, datetimeUtcField, datetimeLocalField;
        
        coordinatesField = document.getElementById("coordinates");
        elevationField = document.getElementById("elevation");
        datetimeUtcField = document.getElementById("datetimeUTC");
        datetimeLocalField = document.getElementById("datetimeLocal");
        
        coordinatesField.innerText = '-';
        elevationField.innerText = '-';
        datetimeUtcField.innerText = '-';
        datetimeLocalField.innerText = '-';
        
        this.loadCountryOutlines(this.countryOutlinesUrl);
    },
    
    loadCountryOutlines: function (url) {
    	var scope = this;
        $.getJSON(url) 
            .done(function( json ) {
                scope.countryOutlines = json; 
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    },

    setGeoTracks: function (geoTracks) {
        this.geoTracks = geoTracks;
    },

    setCurrentTrackIdx: function (idx) {
        var coordinatesField, elevationField, datetimeUtcField, countryNameField;
        var coords, time, timezone;    
        
        coords = this.geoTracks.features[0].geometry.coordinates[idx];
        time = Date.parse(this.geoTracks.features[0].properties.coordTimes[idx]);

        coordinatesField = document.getElementById("coordinates");
        elevationField = document.getElementById("elevation");
        datetimeUtcField = document.getElementById("datetimeUTC");
        datetimeLocalField = document.getElementById("datetimeLocal");
        countryNameField = document.getElementById("country");
        
        coordinatesField.innerText = coords[0] + ', ' + coords[1];
        elevationField.innerText = coords[2] + ' metres';
        datetimeUtcField.innerText = this.formatTime(time);
        
        timezone = this.approximateTimezoneFromCoord(coords);
        time = this.approximateLocalTimeMillis(time,coords);
        datetimeLocalField.innerText = this.formatTime(time, timezone);
        
        var countryName = this.findCountryName(coords);
        if (!countryName) {
            countryName = '-';
        }
        countryNameField.innerText = countryName;
    },
    
    findCountryName: function(coord) {
        var features, i, j, poly;
        var point1 = turf.point(coord);
        
        if (this.countryOutlines) {
            features = this.countryOutlines.features;
            for (i=0; i<features.length; i++) {
            
                 if ( features[i].geometry.type === 'MultiPolygon' ) {
                     for (j=0; j<features[i].geometry.coordinates.length; j++) {
                          poly = turf.polygon(features[i].geometry.coordinates[j]);
                          try {
							  if (turf.intersect(poly, point1)) {
								 return features[i].properties.name;
							 }                             
						  } catch (e) {
						      // typically happens due to a geometry issue
						      console.error(e, features[i].id, j);
						  }
                     }
                 } else if ( features[i].geometry.type === 'Polygon' ) {
                     poly = turf.polygon(features[i].geometry.coordinates[0]); 
                     
                     if (turf.intersect(poly, point1)) {
                         return features[i].properties.name;
                     }                
                 } else {
                     console.error('unknown geometry type: ' + features[i].geometry.type);
                 }
            }
        }        
    },

    dualDigitsString: function (value) {
        if (value < 10 ) {
            return '0' + value;
        }
        return '' + value;
    },
    
    formatTime(utcTimeInMillis, timezoneOffset) {
        var datetime = new Date(utcTimeInMillis);
        var formattedTime = 
            datetime.getUTCFullYear() + '-' +
            this.dualDigitsString(datetime.getUTCMonth() + 1) + '-' +	
            this.dualDigitsString(datetime.getUTCDate()) + ' ' +
            this.dualDigitsString(datetime.getUTCHours()) + ':' +
            this.dualDigitsString(datetime.getUTCMinutes()) + ':' +        
            this.dualDigitsString(datetime.getUTCSeconds());
        
        if (timezoneOffset !== undefined) {
        	formattedTime += ' UTC' + timezoneOffset;
        }
        
        return formattedTime;
    },
    
    approximateTimezoneFromCoord(coord) {
    	return Math.round(12 * (coord[0] / 180));
    },
    
    approximateLocalTimeMillis: function (utcTimeInMillis, coord) {
         var dateTime = new Date(utcTimeInMillis);
         var hours = dateTime.getUTCHours();         
         return utcTimeInMillis + this.approximateTimezoneFromCoord(coord) * 3600000;
    },
    
    registerCoodinateChangeCallback: function (callback) {
        // TODO
    }
};
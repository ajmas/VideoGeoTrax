var rawEntries = [
    ['00:00:05', '53.623000, -2.574910'],
    ['00:01:47', '53.623000, -2.574910'],
    ['00:03:06', '53.623000, -2.574910'],
    ['00:05:21', '53.623000, -2.574910'],
    ['00:07:01', '53.623000, -2.574910'],
    ['00:08:20', '53.623000, -2.574910'],
    ['00:10:57', '53.623000, -2.574910'],
    ['00:13:43', '53.623000, -2.574910'],
    ['00:14:31', '53.623000, -2.574910'],
    ['00:14:40', '53.623000, -2.574910'],
    ['00:15:11', '53.623000, -2.574910'],
    ['00:16:54', '53.623000, -2.574910'],
    ['00:18:29', '53.623000, -2.574910'],
    ['00:18:30', '53.623000, -2.574910'],
    ['00:20:54', '53.623000, -2.574910'],
    ['00:23:24', '53.623000, -2.574910'],
    ['00:24:51', '53.623000, -2.574910'],
    ['00:26:47', '53.623000, -2.574910'],
    ['00:26:48', '53.623000, -2.574910'],
    ['00:28:21', '53.623000, -2.574910'],
    ['00:32:00', '53.623000, -2.574910'],
    ['00:33:06', '53.623000, -2.574910'],
    ['00:43:16', '53.623000, -2.574910'],
    ['00:44:40', '53.623000, -2.574910'],
    ['00:49:19', '53.623000, -2.574910'],
    ['00:50:10', '53.623000, -2.574910'],
    ['00:51:22', '53.623000, -2.574910'],
    ['00:52:36', '53.623000, -2.574910'],
    ['00:54:29', '53.623000, -2.574910'],
    ['00:54:55', '53.623000, -2.574910'],
    ['00:56:24', '53.623000, -2.574910'],
    ['00:57:06', '53.623000, -2.574910'],
    ['00:57:06', '53.623000, -2.574910'],
    ['00:59:42', '53.623000, -2.574910']
    ];
    
var entries = [];

function init() {
    var i=0;
    for (i=0; i<rawEntries.length; i++ ) {
        var rawTime = rawEntries[i][0];
        var parts = rawTime.split(':');
        var time = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        //console.log(time);
    }
    
}

// ------------------


function getMetadataTrack() {
    if (!metadataTrack) {
        return document.getElementById("metadataTrack");
    } else {
        return metadataTrack;
    }
}

function initMetadataTrackEvents() {
	var track = getMetadataTrack();
    track.addEventListener("cuechange", function () {
		var myTrack = getMetadataTrack();             // track element is "this" 
		var myCues = myTrack.activeCues;      // activeCues is an array of current cues.                                                    
		if (myCues.length > 0) {
			var coordinatesField = document.getElementById("coordinates");
			var elevationField = document.getElementById("elevation");
			var datetimeField = document.getElementById("datetime");

// 			console.log(myCues[0].start, myCues[0].end );
			try {
				//console.log('text', myCues[0].text,  myCues[0]);
				var obj = JSON.parse(myCues[0].text);
				coordinatesField.innerText = obj.geometry.coordinates[0] + ', ' + obj.geometry.coordinates[1]; 
				elevationField.innerText = obj.geometry.coordinates[2] + ' m';
				datetimeField.innerText = new Date(obj.geometry.coordinates[3]).toUTCString();
				moveFeature(geoMarker, obj.geometry.coordinates);
			} catch (e) {
    			coordinatesField.innerText = 'n/a';
    			elevationField.innerText = 'n/a';
    			datetimeField.innerText = 'n/a';
				console.log('not json: ' + myCues[0].text);
			}		
		}
	});
}


var mapAndVideo = {
    map: '',
    video: ''
};
var routeExtent;

function initMap () {

	loadGpx('media/Partial Eurostar journey.gpx', function (data) {
	    geoJsonToTrack(toGeoJSON.gpx(data));
	    
	    initMap2();
	});
}

function initMap2 () {
   var coord = [80.03125, 39.7265625];
   
   geoMarker = new ol.Feature({
      type: 'geoMarker',
       geometry: new ol.geom.Point(coord)
   });

    styles = {
       'geoMarker': new ol.style.Style({
           image: new ol.style.Circle({
               radius: 7,
               snapToPixel: false,
               fill: new ol.style.Fill({color: 'black'}),
               stroke: new ol.style.Stroke({
                   color: 'white', width: 2
               })
            })
        }),
        'route': new ol.style.Style({
			stroke: new ol.style.Stroke({
			   color: '#ffcc33',
			   width: 6
			})  
		})        
    };
 
    var routeLine = new ol.geom.LineString(getFullRoute());
    routeLine.transform('EPSG:4326', 'EPSG:3857');
        
    var routeFeature = new ol.Feature({
       type: 'route',
       name: 'Line',
       geometry: routeLine
    });
    
    routeExtent = routeLine.getExtent();
    
     vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [routeFeature, geoMarker]
      }),
      style: function(feature, resolution) {
        // hide geoMarker if animation is active
        if (feature.get('type') === 'geoMarker') {
          return [];
        }
        return [styles[feature.get('type')]];
      }
    });    
    
    map = new ol.Map({
      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        vectorLayer
      ],
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      target: 'map',
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      })
    });

    $('#map .message').html('');


    // Adjust the map as soon as the display mode is changed
	$("input[type='radio'][name='displayMode']").click(function() {
	    if ($(this).val() == 'keepCentered') {
	        var point = getCurrentPoint();
	        if (!point) {
	            point = getFullRoute()[0];
	        }
	        centerMap(point);
	    } else if ($(this).val() == 'frameRoute') {
	        frameRoute();
	    }
	});   
	
	initMetadataTrackEvents();

}

function getCurrentPoint() {
    var track = getMetadataTrack();
    var cues = (track.cues?track.cues:track.track.cues);    
    if (cues.length > 0) {
    	var disp = document.getElementById("coordinates");
		try {
		    console.log('xue',cue);
			var obj = JSON.parse(cues[i].text);
			return obj.geometry.coordinates;
		} catch (e) {
			console.log('not json: ' + cues[0].text);
		}              
    }
    return undefined;
}

function getFullRoute (coords) {
    var i=0;
    var track = getMetadataTrack();
    console.log('track', track);
    var cues = (track.cues?track.cues:track.track.cues);
    var pathCoords = [];
    for (i=0; i < cues.length; i++) {
         if (cues[i].text) {
            try {
                var obj = JSON.parse(cues[i].text);
                pathCoords.push( obj.geometry.coordinates );
            } catch (e) {
                console.log('not json: ' + myCues[0].text);
            }         
         }
    }
	return pathCoords;
}


function centerMap (coords) {
    map.getView().setCenter(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'));
    //map.getView().setZoom(5);
}


 
function isKeepCentered() {
    var selectedVal = "";
    var selected = $("input[type='radio'][name='displayMode']:checked");
    if (selected.length > 0) {
        return (selected.val() === 'keepCentered');                
    }
    return false;
}

function isFrameRoute() {
    var selectedVal = "";
    var selected = $("input[type='radio'][name='displayMode']:checked");
    if (selected.length > 0) {
        return (selected.val() === 'frameRoute');                
    }
    return false;
}

function frameRoute () {
    extent = routeExtent;
	map.getView().fit(extent, map.getSize()); 

}

var moveFeature = function(feature, coords) {

    feature.setGeometry(
        new ol.geom.Point(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'))
        );            
     feature.setStyle(styles.geoMarker);

    if (isKeepCentered()) {
        centerMap(coords);
    } else if (isFrameRoute()) {
        frameRoute(coords);
    }
}

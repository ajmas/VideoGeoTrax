
function loadGpx(url, callback) {
 	$.ajax({
       url: url,
       type: "GET",
       dataType: "xml",
       success: function (result) {
            callback(result);
//             $(result).find('name').each(callback);
        }
    });
}

function geoJsonToTrack (geojson)  {
    var points = geojson.features[0].geometry.coordinates;
    var times  = geojson.features[0].properties.coordTimes;

    var video = document.getElementById("myVideo"), track, i; 
	
	track = video.addTextTrack("metadata", "coordinates", "xx"); 
	track.mode = 'showing';
	$(track).attr('id','metadataTrack');
	
// 	console.log(track);
	
	metadataTrack = track;
	
// 	console.log('ccc', document.getElementById("metadataTrack"));
	
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

}


function loadGpx(url, callback) {
	$.ajax({
	   url: url,
	   type: "GET",
	   dataType: "xml",
	   success: function (result) {
			callback(result);
		}
	});
}	

window.addEventListener("load",function(eventData) {
	mapView.init();
	videoView.init();
	
	loadGpx('media/Partial Eurostar journey.gpx', function (data) {
		
		var geoJSON = toGeoJSON.gpx(data);
		
		videoView.setGeoTracks(geoJSON);
		mapView.setGeoTracks(geoJSON);
		dataView.setGeoTracks(geoJSON);
		
		videoView.registerCoodinateChangeCallback( function (coordinate, geoTracks, idx) {			        
			mapView.setCurrentTrackIdx(idx);
			dataView.setCurrentTrackIdx(idx);
		});
		
	});			
});
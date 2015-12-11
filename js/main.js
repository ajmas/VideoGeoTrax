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
    var videoUrl = 'media/bike-ride.m4v';
    var mapUrl = videoUrl.substring(0, videoUrl.lastIndexOf('.')) + '.gpx';

    mapView.init();
    videoView.init();
    dataView.init();
    
    loadGpx(mapUrl, function (data) {
        
        var geoJSON = toGeoJSON.gpx(data);
        
        videoView.setGeoTracks(geoJSON);
        mapView.setGeoTracks(geoJSON);
        dataView.setGeoTracks(geoJSON);
        elevationView.setGeoTracks(geoJSON);
        
        videoView.registerCoodinateChangeCallback( function (coordinate, geoTracks, idx) {            
            mapView.setCurrentTrackIdx(idx);
            dataView.setCurrentTrackIdx(idx);
            elevationView.setCurrentTrackIdx(idx);

        });
        
    });            
});
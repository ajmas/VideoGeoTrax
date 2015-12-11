var elevationView = {

    geoTracks: {},
    linechart: undefined,
    
    init: function () {
        // TODO                
    },

    setGeoTracks: function (geoTracks) {
        this.geoTracks = geoTracks;
        
        var graphData = [];
        
        var points = geoTracks.features[0].geometry.coordinates;
        var times  = geoTracks.features[0].properties.coordTimes;
        
        for (i=0; i<points.length; i++) {                
            var timeOffset = (Date.parse(times[i]) - Date.parse(times[0])) / 60000;
            
            graphData.push({
                x: Math.round(timeOffset * 10000) / 10000,
                y: Math.round(points[i][2] * 10) / 10,
                id: i
                });
        }        
              
		$('#elevationbox').highcharts({
			title: {
				text: 'Elevation',
				x: -20 //center
			},
			xAxis: {
				title: {
					text: 'Time from start (minutes)'
				},    
				labels: {
					formatter: function() {
						return this.value + ':00';
					}
				}				            
			},
			yAxis: {
				title: {
					text: 'Elevation (m)'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				valueSuffix: ' metres'
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			series: [{
			    name: 'Elevation',
			    showInLegend: false,
				data: graphData
			}],
			marker: {
			    enabled: true
			}
		});
    },

    setCurrentTrackIdx: function (idx) {
    	
    	var highcharts = $('#elevationbox').highcharts();
    	var point = highcharts.get(idx);

    	if ( point !== undefined) { 		
			highcharts.xAxis[0].removePlotLine('current');
			highcharts.xAxis[0].addPlotLine({
					id: 'current',
					color: 'black',
					width: 2,
					value: point.x
				});
		}
    },

    registerCoodinateChangeCallback: function (callback) {
        // TODO
    }

};
/* jshint strict: false */
/* global $, ol */

var mapView = {

    displayMode: 'frameRoute',
    geoTracks: {},
    map: undefined,
    showMarker: false,
    showRoute: false,
    currentIdx: -1,

    init: function() {
        var scope = this;

        // allow getting layer by id
        if (ol.Map.prototype.getLayer === undefined) {
            ol.Map.prototype.getLayer = function (id) {
                var layer;
                this.getLayers().forEach(function (lyr) {
                    if (id == lyr.get('id')) {
                        layer = lyr;
                    }
                });
                return layer;
            };
        }

        var geoMarker = new ol.Feature({
            type: 'geoMarker',
            geometry: new ol.geom.Point([0,0])
        });
        geoMarker.setId('geoMarker');

        this.styles = {
            'geoMarker': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({
                        color: 'black'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
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

        var vectorLayer = new ol.layer.Vector({
            id: 'myVectorLayer',
            source: new ol.source.Vector({
                features: [geoMarker]//routeFeature, geoMarker]
            }),
            style: function(feature, resolution) {
                if (!scope.showMarker && feature.get('type') === 'geoMarker') {
                    return [];
                }
                return [scope.styles[feature.get('type')]];
            }
        });

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
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

        $("input[type='radio'][name='displayMode']").click(function() {
            if ($(this).val() == 'keepCentered') {
                scope.displayMode = 'keepCentered';
                var idx = scope.currentIdx;
                if (idx < 0) {
                    idx = 0;
                }
                scope.centerMap(
                    scope.geoTracks.features[0].geometry.coordinates[idx]
                    );
            } else if ($(this).val() == 'frameRoute') {
                scope.displayMode = 'frameRoute';
                scope.frameRoute();
            } else {
                scope.displayMode = 'manual';
            }
        });
    },

    setDisplayMode: function(displayMode) {
        this.displayMode = displayMode;
    },

    setGeoTracks: function(geoTracks) {
        this.geoTracks = geoTracks;

        var routeLine = new ol.geom.LineString(
            this.geoTracks.features[0].geometry.coordinates
            );
        routeLine.transform('EPSG:4326', 'EPSG:3857');

        var routeFeature = new ol.Feature({
           type: 'route',
           name: 'route',
           geometry: routeLine
       });

       this.routeExtent = routeLine.getExtent();

       this.map.getLayer('myVectorLayer').getSource().addFeature(routeFeature);
       this.frameRoute();

       this.showMarker = true;
    },

    setCurrentTrackIdx: function(idx) {
        var coords = this.geoTracks.features[0].geometry.coordinates[idx];
        var geoMarker = this.map.getLayer('myVectorLayer').getSource().getFeatureById('geoMarker');
        this.moveFeature(geoMarker, coords);
        this.currentIdx = idx;
    },

    registerCoodinateChangeCallback: function(callback) {

    },

    fireCoodinateChangeEvent: function(coordinate) {

    },

    centerMap: function(coords) {
        this.map.getView().setCenter(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'));
    },

    frameRoute: function() {
        this.map.getView().fit(this.routeExtent, this.map.getSize());
    },

    moveFeature: function(feature, coords) {
        feature.setGeometry(
            new ol.geom.Point(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'))
        );

        feature.setStyle(this.styles.geoMarker);

        if (this.displayMode === 'keepCentered') {
            this.centerMap(coords);
        } else if (this.displayMode === 'frameRoute') {
            this.frameRoute();
        }
    }

};


require([
    "esri/Map",
    "esri/views/SceneView"
], function(Map, SceneView) {

    var map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation"  // show elevation
    });

    var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            heading:0,
            position: {  // observation point
                x: 3.616667,
                y: 49.566667,
                z: 25000 // altitude in meters
            },
            tilt: 0  // perspective in degrees

        }
    });
});
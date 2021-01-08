require([
    "esri/Map",
    "esri/views/MapView"
], function(Map, MapView) {

    var map = new Map({
        basemap: "topo-vector"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [3.616667,49.566667], // longitude, latitude
        zoom: 10
    });
});
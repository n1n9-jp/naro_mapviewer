/* --------------------
 Initialize: Variables
-------------------- */

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXlhemFraSIsImEiOiJjbTVxZzhrdmMwYmplMnFvazc2bHhnYnJzIn0.3_IEtaI7ZSFcRiaQfZaL_Q';

var mapObject;
var prefNameArray = ["Tokyo"];
var yearNameArray = ["2016"];
var yearIndex = 0;

// var urlThemeDomain = 'https://n1n9-jp.github.io/mvt/gd/';
// var urlThemeDomain = 'http://n1n9-jp.github.io/';
var urlThemeDomain = 'http://127.0.0.1:5500/';

// var fileName = yearNameArray[yearIndex] + '/' + prefNameArray[0];
var fileName = "asb";



const POI = [
    { "city": "Tokyo Station", "longitude": 139.767125, "latitude": 35.681236, "zoom": 12, "bearing": 0 }
];

/* 多様性指数の種類 */
var diversArray = ["H_sub","B_sub"]
var diversIndex = 0;



var initBaseMap = function() {

    console.log("initBaseMap");


    mapObject = new mapboxgl.Map({
        "container": "themeMap",
        "center": [POI[0]["longitude"], POI[0]["latitude"]],
        "zoom": POI[0]["zoom"],
        "minZoom": 12,
        "maxZoom": 14,
        "pitch": POI[0]["pitch"], 
        "minPitch": 0,
        "maxPitch": 85,
        "bearing": POI[0]["bearing"], 
        "hash": true,
        "interactive": true,
        // "style": 'assets/data/style.json'
        "style": 'https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W'
    });
    

    mapObject.on('style.load', function () {

        /*--- 時刻次第で空模様を変更する ---*/
        var currentTime = new Date();
        //console.log("getHours()", currentTime.getHours());

        if ((currentTime.getHours() >= 17) || (currentTime.getHours() <= 6)) {
            mapObject.addLayer({
                'id': 'sky-night',
                'type': 'sky',
                'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [90, 0],
                'sky-atmosphere-halo-color': 'rgba(255, 255, 255, 0.5)',
                'sky-atmosphere-color': 'rgba(255, 255, 255, 0.2)',
                'sky-opacity': 1,
                'sky-opacity-transition': { 'duration': 500 }
                }
            });
        } else {
            mapObject.addLayer({
                'id': 'sky-day',
                'type': 'sky',
                'paint': {
                'sky-type': 'gradient',
                'sky-opacity': 1,
                'sky-opacity-transition': { 'duration': 500 }
                }
            });
        }

        /*--- 次を呼び出し ---*/
        PubSub.publish('draw:thememapYear');

    });
};



var drawThemeMapByYear = function() {

    console.log("drawThemeMapByYear");


    // ファイル名を生成
    // var fileName = yearNameArray[yearIndex] + '/' + prefNameArray[0];
    var urlThemeData = urlThemeDomain + fileName + '/{z}/{x}/{y}.pbf'
    console.log("urlThemeData", urlThemeData);

    // データソース追加
    mapObject.addSource(fileName, {
        'type': 'vector',
        'tiles': [
            urlThemeData
        ],
        "minzoom": 12,
        "maxzoom": 14,
        "attribution": ''
    });



    /* --------------------
    draw Maps
    -------------------- */

    /* case: fill */
    mapObject.addLayer({
        "id": fileName,
        "type": "fill",
        "source": fileName,
        "source-layer": "5_joint",
        "minzoom": 12,
        "maxzoom": 14,
        "paint": {
            'fill-color': '#ff00ff',
            'fill-opacity': 1.0,
            'fill-outline-color': '#ffffff',
        }
    });

    console.log("mapObject", mapObject.getStyle().layers);
};



PubSub.subscribe('init:basemap', initBaseMap);
PubSub.subscribe('draw:thememapYear', drawThemeMapByYear);

PubSub.publish('init:basemap');
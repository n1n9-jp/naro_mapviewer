/* --------------------
 Initialize: Variables
-------------------- */

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXVpY2h5IiwiYSI6ImNrcW43dXA0YTA4eTEyb28yN25jeTN0ZHMifQ.7v7OJoeJXp2fqX5vloX-PQ';

const POI = [
    { "city": "Tokyo Station", "longitude": 139.767125, "latitude": 35.681236, "zoom": 12, "bearing": 0 }
];

/* FilePath */
var dir1=[], dir2=[], dir3=[], fullpath=[];
var themedata;
var dataObjMap;

/* Swiper UI */
var probArray = ["L0","H0"]
var probLabelArray = ["Low 0","High 0"]
var probIndex = 0;




/* --------------------
 Initialize: Variables
-------------------- */





var initBaseMap = function() {
    console.log("initBaseMap");

    mapObject = new mapboxgl.Map({
        "container": "themeMap",
        "center": [POI[0]["longitude"], POI[0]["latitude"]],
        "zoom": POI[0]["zoom"],
        "minZoom": 6,
        "maxZoom": 16,
        "pitch": POI[0]["pitch"], 
        "minPitch": 0,
        "maxPitch": 85,
        "bearing": POI[0]["bearing"], 
        "hash": true,
        "interactive": true,
        "style": 'https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W',
        });

    PubSub.publish('init:nav');
}


var initNav = function() {
    console.log("initNav");

    Promise.all([
        d3.csv("assets/data/filelist.csv")
    ]).then(function (_data) {
    
        fullpath = _.cloneDeep(_data[0]);

        for(var i=0; i<_data[0].length; i++) {
            var _t = _data[0][i].filepath.split('/');
            dir1.push(_t[0]);
            dir2.push(_t[1]);
            dir3.push(_t[2]);            
        }
        console.log( dir1 );
        console.log( dir2 );
        console.log( dir3 );
        console.log( fullpath );
        
        PubSub.publish('init:mapui');
    });



    /* Diversity Var Slider */
    var probItems = d3.select("#swiperProbability")
        .selectAll("div")
        .data(probArray)
        .enter();

    probItems.append("div")
        .attr('class', function () {
            return "swiper-slide";
        })
        .text(function (d, i) {
            return probLabelArray[i];
        });

    swiperProbability = new Swiper('#swiper-container-prob', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-prob',
            prevEl: '#swiper-button-prev-prob',
        },
    });

    swiperProbability.on('slideChange', function () {
        probIndex = swiperDivers.activeIndex;
        console.log("probIndex", probIndex);
    });
}



var initMapUI = function() {
    console.log("initMapUI");

    var nav = new mapboxgl.NavigationControl();
    mapObject.addControl(nav, 'top-right');

    PubSub.publish('load:basemap');
}





var loadBasemap = function() {
    console.log("loadBasemap");

    Promise.all([
        d3.json("assets/data/" + "N03-19_190101_edit_final_1mm.json")
    ]).then(function (_data) {
        dataObjMap = _.cloneDeep(_data[0]);

        PubSub.publish('load:themedata');
    });
}



var loadThemeData = function() {
    console.log("loadThemeData");

    // detect swiper

    // load: theme data
    Promise.all([
        d3.csv("assets/data/" + fullpath[0]['filepath'])
    ]).then(function (_data) {
  
        themedata = _.cloneDeep(_data[0]);

        /* 自治体コードが4桁の場合、右端に0を付与 */
        for (var i=0; i<themedata.length; i++){
            if (themedata[i]["MuniCode"].length == 4){
                themedata[i]["MuniCode"] = "0" + themedata[i]["MuniCode"];
            }
        }

        console.log("themedata", themedata);
        PubSub.publish('draw:map');
    });
}



var drawMap = function() {
    console.log("drawMap");

    // combine base map& theme data

    for(var i=0; i<dataObjMap.features.length; i++) {

        var _muniid = dataObjMap.features[i]["properties"]["N03_007"];

        var _fl = false;
        for(var j=0; j<themedata.length; j++) {
            if (themedata[j]["MuniCode"] == _muniid){
                dataObjMap.features[i]["properties"]["mean"] = parseFloat(themedata[j]["mean"]);
                dataObjMap.features[i]["properties"]["sd"] = parseFloat(themedata[j]["sd"]);
                dataObjMap.features[i]["properties"]["L0"] = parseFloat(themedata[j]["L0"]);
                dataObjMap.features[i]["properties"]["H0"] = parseFloat(themedata[j]["H0"]);
                _fl = true;
            }
        }

        if (!_fl){
            dataObjMap.features[i]["properties"]["mean"] = 0;
            dataObjMap.features[i]["properties"]["sd"] = 0;
            dataObjMap.features[i]["properties"]["L0"] = 0;
            dataObjMap.features[i]["properties"]["H0"] = 0;
        }
    }

    // draw: basemap
    mapObject.addSource('maine', {
        'type': 'geojson',
        'data': dataObjMap
    });
         
    mapObject.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'maine', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    });

    console.log("dataObjMap", dataObjMap);
}


var showDetail = function() {
    console.log("showDetail");

}



var hideDetail = function() {
    console.log("hideDetail");

}



PubSub.subscribe('init:basemap', initBaseMap);
PubSub.subscribe('init:nav', initNav);
PubSub.subscribe('init:mapui', initMapUI);

PubSub.subscribe('load:basemap', loadBasemap);
PubSub.subscribe('load:themedata', loadThemeData);
PubSub.subscribe('draw:map', drawMap);

PubSub.subscribe('show:detail', showDetail);
PubSub.subscribe('hide:detail', hideDetail);

PubSub.publish('init:basemap');
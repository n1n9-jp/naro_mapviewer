/* --------------------
 Initialize: Variables
-------------------- */

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXVpY2h5IiwiYSI6ImNrcW43dXA0YTA4eTEyb28yN25jeTN0ZHMifQ.7v7OJoeJXp2fqX5vloX-PQ';

const POI = [
    { "city": "Tokyo Station", "longitude": 139.767125, "latitude": 35.681236, "zoom": 12, "bearing": 0 }
];

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
        "minZoom": 12,
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

    PubSub.publish('init:mapui');
}



var initMapUI = function() {
    console.log("initMapUI");

    var nav = new mapboxgl.NavigationControl();
    mapObject.addControl(nav, 'top-right');

    PubSub.publish('load:basemap');
}



var loadBasemap = function() {
    console.log("loadBasemap");

    PubSub.publish('load:themedata');
}



var loadThemeData = function() {
    console.log("loadThemeData");

    PubSub.publish('draw:map');
}



var drawMap = function() {
    console.log("drawMap");

    PubSub.publish('change:data');
}



var changeData = function() {
    console.log("changeData");

    // PubSub.publish('change:data');
}



PubSub.subscribe('init:basemap', initBaseMap);
PubSub.subscribe('init:nav', initNav);
PubSub.subscribe('init:mapui', initMapUI);

PubSub.subscribe('load:basemap', loadBasemap);
PubSub.subscribe('load:themedata', loadThemeData);
PubSub.subscribe('draw:map', drawMap);
PubSub.subscribe('change:data', changeData);

PubSub.publish('init:basemap');
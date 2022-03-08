/* --------------------
 Initialize: Variables
-------------------- */

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXVpY2h5IiwiYSI6ImNrcW43dXA0YTA4eTEyb28yN25jeTN0ZHMifQ.7v7OJoeJXp2fqX5vloX-PQ';





/* --------------------
 Initialize: Variables
-------------------- */





var initBaseMap = function() {
    console.log("initBaseMap");

    PubSub.publish('init:nav');
}


var initNav = function() {
    console.log("initNav");

    PubSub.publish('init:mapui');
}



var initMapUI = function() {
    console.log("initMapUI");

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
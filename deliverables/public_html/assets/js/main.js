/* --------------------
 設定パラメータ
-------------------- */

/* Data Scale */
var minData = 0;
var maxData = 100;

/* Color Scale */
var minColor = "#333333";
var maxColor = "#FFFFFF";

/* Height Scale */
var minHeight = 0;
var maxHeight = 50000;

/* Map Tile */
maptileURL = "https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W";

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXVpY2h5IiwiYSI6ImNrcW43dXA0YTA4eTEyb28yN25jeTN0ZHMifQ.7v7OJoeJXp2fqX5vloX-PQ';




var POI = [
    { "city": "Tokyo Station", "longitude": 139.767125, "latitude": 35.681236, "zoom": 6, "bearing": 0 }
];




/* --------------------
 Initialize: Variables
-------------------- */

/* FilePath */
var dir1=[], dir2=[], dir3=[];
var dir1Index = 0;
var dir2Index = 0;
var dir3Index = 0;
var fullpath=[];

/* Data Object */
var dataObjTheme;
var dataObjMap;

/* Swiper UI */
var probArray = ["L0","H0"]
var probLabelArray = ["Low 0","High 0"]
var probIndex = 0;

/* Flag */
var fl_firsttime = true;

/* misc */
var hoveredStateId = null;



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
        "style": maptileURL
        });

    PubSub.publish('init:nav');
}


var initNav = function() {
    console.log("initNav");

    Promise.all([
        d3.csv("assets/data_lib/filelist.csv")
    ]).then(function (_data) {
    
        fullpath = _.cloneDeep(_data[0]);

        for(var i=0; i<_data[0].length; i++) {
            var _t = _data[0][i].filepath.split('/');
            dir1.push(_t[0]);
            dir2.push(_t[1]);
            dir3.push(_t[2]);
        }

        dir1 = _.uniq(dir1);
        dir2 = _.uniq(dir2);
        dir3 = _.uniq(dir3);

        for (i=0; i<dir3.length; i++) {
            dir3[0] = dir3[0].replace(".csv", "");
        }

        console.log( dir1 );
        console.log( dir2 );
        console.log( dir3 );
        console.log( fullpath );
        


        /* Dir1 Var Slider */
        var dir1Items = d3.select("#swiperDir1")
            .selectAll("div")
            .data(dir1)
            .enter();

        dir1Items.append("div")
            .attr('class', function () {
                return "swiper-slide";
            })
            .text(function (d, i) {
                return d;
            });

        swiperDir1 = new Swiper('#swiper-container-dir1', {
            slidesPerView: 2,
            spaceBetween: 1,
            centeredSlides: true,
            navigation: {
                nextEl: '#swiper-button-next-dir1',
                prevEl: '#swiper-button-prev-dir1',
            },
        });

        swiperDir1.on('slideChange', function (e) {
            console.log("", e.activeIndex);
            dir1Index = e.activeIndex;
            PubSub.publish('load:themedata');
        });



        /* Dir2 Var Slider */
        var dir2Items = d3.select("#swiperDir2")
            .selectAll("div")
            .data(dir2)
            .enter();

        dir2Items.append("div")
            .attr('class', function () {
                return "swiper-slide";
            })
            .text(function (d, i) {
                return d;
            });

        swiperDir2 = new Swiper('#swiper-container-dir2', {
            slidesPerView: 2,
            spaceBetween: 1,
            centeredSlides: true,
            navigation: {
                nextEl: '#swiper-button-next-dir2',
                prevEl: '#swiper-button-prev-dir2',
            },
        });

        swiperDir2.on('slideChange', function (e) {
            console.log("", e.activeIndex);
            dir2Index = e.activeIndex;
            PubSub.publish('load:themedata');
        });



        /* Dir3 Var Slider */
        var dir3Items = d3.select("#swiperDir3")
            .selectAll("div")
            .data(dir3)
            .enter();

        dir3Items.append("div")
            .attr('class', function () {
                return "swiper-slide";
            })
            .text(function (d, i) {
                return d;
            });

        swiperDir3 = new Swiper('#swiper-container-dir3', {
            slidesPerView: 2,
            spaceBetween: 1,
            centeredSlides: true,
            navigation: {
                nextEl: '#swiper-button-next-dir3',
                prevEl: '#swiper-button-prev-dir3',
            },
        });

        swiperDir3.on('slideChange', function (e) {
            console.log("", e.activeIndex);
            dir3Index = e.activeIndex;
            PubSub.publish('load:themedata');
        });


        PubSub.publish('init:mapui');
    });



    /* Probability Var Slider */
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

    swiperProbability.on('slideChange', function (e) {
        // console.log("", e.activeIndex);
        probIndex = e.activeIndex;
        // console.log("probIndex", probIndex);
        PubSub.publish('update:map');
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
        d3.json("assets/data_lib/" + "japanmap.json")
    ]).then(function (_data) {
        dataObjMap = _.cloneDeep(_data[0]);

        PubSub.publish('load:themedata');
    });
}



var loadThemeData = function() {
    console.log("loadThemeData");

    // detect swiper
    var _filepath = "assets/data_index/" + dir1[dir1Index] + "/" + dir2[dir2Index] + "/" + dir3[dir3Index] + ".csv";

    // load: theme data
    Promise.all([
        d3.csv(_filepath)
    ]).then(function (_data) {
  
        dataObjTheme = _.cloneDeep(_data[0]);

        /* 自治体コードが4桁の場合、右端に0を付与 */
        for (var i=0; i<dataObjTheme.length; i++){
            if (dataObjTheme[i]["MuniCode"].length == 4){
                dataObjTheme[i]["MuniCode"] = "0" + dataObjTheme[i]["MuniCode"];
            }
        }

        console.log("dataObjTheme", dataObjTheme);
        PubSub.publish('draw:map');
    });
}



var drawMap = function() {
    console.log("drawMap");

    // combine base map& theme data

    for(var i=0; i<dataObjMap.features.length; i++) {

        var _muniid = dataObjMap.features[i]["properties"]["N03_007"];

        var _fl = false;
        for(var j=0; j<dataObjTheme.length; j++) {
            if (dataObjTheme[j]["MuniCode"] == _muniid){
                dataObjMap.features[i]["properties"]["mean"] = parseFloat(dataObjTheme[j]["mean"]);
                dataObjMap.features[i]["properties"]["sd"] = parseFloat(dataObjTheme[j]["sd"]);
                dataObjMap.features[i]["properties"]["L0"] = parseFloat(dataObjTheme[j]["L0"]);
                dataObjMap.features[i]["properties"]["H0"] = parseFloat(dataObjTheme[j]["H0"]);
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
    console.log("dataObjMap", dataObjMap);



    // draw: basemap

    if (fl_firsttime){

        mapObject.addSource('naro', {
            'type': 'geojson',
            'data': dataObjMap
        });
    
        mapObject.addLayer({
            'id': 'naro_prob',
            //'type': 'fill',
            'type': 'fill-extrusion',
            'source': 'naro',
            'layout': {},
            "paint": {
                'fill-extrusion-color': [
                    'interpolate', ['linear'],
                    ['get', probArray[probIndex]],
                    minData, minColor,
                    maxData, maxColor
                ],
                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['get', probArray[probIndex]],
                    minData, 0,
                    maxData, 50000
                ],
                // 'fill-extrusion-opacity': [
                //     'case',
                //     ['boolean', ['feature-state', 'hover'], false],
                //     1.0,
                //     0.5
                // ],
            }
        });


        mapObject.on('click', 'naro_prob', function (e) {
            //console.log("local ID: ", e.features[0].properties.N03_007);
            var _selected = e.features[0].properties.N03_007;

            //console.log( "image name: ",dir1[dir1Index] + "_" + dir2[dir2Index] + "_" + dir3[dir3Index] + "_" + _selected + ".png");

            console.log( "assets/data_detail/" + dir1[dir1Index] + "/" + dir2[dir2Index] + "/" + dir3[dir3Index] + "/" + _selected + ".png");


            var lightbox = lity('popup.html');

            window.setTimeout(function(){

                console.log("_selected", _selected);

                // console.log( "hello", document.getElementsByTagName('iframe')[1].contentDocument );

                //console.log( "hello", document.getElementByID('popup')[0].contentDocument.getElementByID('selectedID').text(_selected) );
                //var _s = document.getElementById('popup');


                // console.log("_s", document.getElementsByTagName('iframe')[1]["attributes"]["src"]["nodeValue"] );

                // var _s = document.getElementsByTagName('iframe')[1];
                // console.log("_s", _s.contentDocument );

                // _s.contentDocument.getElementByID("#selectedID").text(_selected);
                // _s.getElementByID("#popup");
                // _s.getElementByID("#selectedID").text(_selected);

                
                var iframeElem = document.getElementsByTagName('iframe');
                var iframeDocument = iframeElem[1].contentDocument || iframeElem[1].contentWindow.document;

                var _pElem1 = iframeDocument.getElementsByClassName('kirakirakira')[0];
                _pElem1.textContent = _selected;



                //pElem.find(".kirakirakira").text = _selected;
                // var _iframes = document.getElementsByTagName('iframe');
                // var _selected;

                // for (i=0; i<_iframes.length; i++) {
                //     if (_iframes[i]["attributes"]["src"]["nodeValue"] != undefined) {
                //         if (_iframes[i]["attributes"]["src"]["nodeValue"] == "popup.html") {
                //             _selected = i;
                //         }
                //     }
                // }
                // console.log( document.getElementsByTagName('iframe')[_selected] );


                // var _s = $('#popup').find('#selectedID');
                // console.log("_s", _s.text("BBB"));

                //_s.getElementById('selectedID').textContent  =_selected;

                // $('#popup').contents().find('body').find("#selectedID").text(_selected);
                //$('#popup').contents().find('body').html('<div> blah </div>');

                // var _s = $("#popup").contents();
                // _s.$("#selectedID").text(_selected);
                // $(".swiperTitle").text(_selected);

            }, 3000);



            

        });





        mapObject.on('mousemove', 'naro_prob', (e) => {

            mapObject.getCanvas().style.cursor = 'pointer';

            // if (e.features.length > 0) {
            //     if (hoveredStateId !== null) {
            //         mapObject.setFeatureState(
            //         { source: 'naro', id: hoveredStateId },
            //         { hover: false }
            //         );
            //     }
            //     console.log("e.features[0]", e.features[0]);
            //     hoveredStateId = e.features[0].properties.N03_007;
            //     mapObject.setFeatureState(
            //         { source: 'naro', id: hoveredStateId },
            //         { hover: true }
            //     );
            // }

        });

        // mapObject.on('mouseenter', 'naro_prob', function () {
        //     mapObject.getCanvas().style.cursor = 'pointer';
        // });
             
        mapObject.on('mouseout', 'naro_prob', function () {
            mapObject.getCanvas().style.cursor = 'auto';
        });


        fl_firsttime = false;
    } else {
        console.log("false");
        mapObject.getSource('naro').setData(dataObjMap);
    }



    console.log("dataObjMap", dataObjMap);
}



var updateMap = function() {
    console.log("updateMap");

    mapObject.setPaintProperty(
        "maine",
        'fill-extrusion-height',
            ['interpolate', ['linear'],
            ['get', probArray[probIndex]],
            minData, minHeight,
            maxData, maxHeight]
    );
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
PubSub.subscribe('update:map', updateMap);



PubSub.subscribe('show:detail', showDetail);
PubSub.subscribe('hide:detail', hideDetail);

PubSub.publish('init:basemap');
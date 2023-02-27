/* --------------------
 関数リスト
-------------------- */
// 一回のみ実行
// initBaseMap() ... MapBox Object 初期化
// initNav() ... ファイルリスト読み込み & ナビ初期化
// initMapUI() ... MapBox UI 初期化
// loadBasemap() ... ベースマップ地図データの読み込み

// ナビ操作のたびに実行
// loadThemeData() ... テーマデータの読み込み
// drawMap() ... テーマデータの描画



/* --------------------
 描画コンテナー
-------------------- */



/* --------------------
 設定パラメータ
-------------------- */
/* MapObject */
var mapObject;

/* Map Tile */
maptileURL = "https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W";

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXVpY2h5IiwiYSI6ImNrcW43dXA0YTA4eTEyb28yN25jeTN0ZHMifQ.7v7OJoeJXp2fqX5vloX-PQ';



var POI = [
  {
    city: "Tokyo Station",
    longitude: 139.767125,
    latitude: 35.681236,
    zoom: 6,
    bearing: 0,
  },
];



/* --------------------
 スケール
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

var colorScale = d3.scaleLinear()
    .domain([minData, maxData])
    .range([minColor, maxColor]);
/* --------------------
 凡例
-------------------- */
var legendGroup, legendTitle, legendGradient, legendValueRight, legendValueLeft;
var defsLegend;
var legendGradientId;
var legendWidth = 200;
var legendHeight = 20;
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
var dataObjMap;     // Base Map
var dataObjTheme;   // Theme Data

/* Swiper UI */
var probArray = ["L0","H0"]
var probLabelArray = ["Low 0","High 0"]
var probIndex = 0;

/* Swiper UI Visualization Scale */
var scaleArray = ["Relative","Absolute"]
var scaleIndex = 0;
/* Flag */
var fl_firsttime = true;

/* misc */
var hoveredStateId = null;



var initBaseMap = function() {
    console.log("initBaseMap");

    mapObject = new mapboxgl.Map({
        "container": "mapboxContainer",
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
        var _dir1Items = d3.select("#swiperDir1")
            .selectAll("div")
            .data(dir1)
            .enter();

        _dir1Items.append("div")
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
        var _dir2Items = d3.select("#swiperDir2")
            .selectAll("div")
            .data(dir2)
            .enter();

        _dir2Items.append("div")
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
        var _dir3Items = d3.select("#swiperDir3")
            .selectAll("div")
            .data(dir3)
            .enter();

        _dir3Items.append("div")
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
    var _probItems = d3.select("#swiperProbability")
        .selectAll("div")
        .data(probArray)
        .enter();

    _probItems.append("div")
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



    /* Visualization Scale Var Slider */
    var scaleItems = d3.select("#swiperVisualizationScale")
        .selectAll("div")
        .data(scaleArray)
        .enter();

    scaleItems.append("div")
        .attr('class', function () {
            return "swiper-slide";
        })
        .text(function (d, i) {
            return scaleArray[i];
        });

    swiperVisualization = new Swiper('#swiper-container-scale', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-scale',
            prevEl: '#swiper-button-prev-scale',
        },
    });

    swiperVisualization.on('slideChange', function (e) {
        // console.log("", e.activeIndex);
        scaleIndex = e.activeIndex;
        console.log("scaleIndex", scaleIndex);
        // PubSub.publish('update:map');
    });


}



var initMapUI = function() {
    console.log("initMapUI");

    var _nav = new mapboxgl.NavigationControl();
    mapObject.addControl(_nav, 'top-right');

    PubSub.publish('init:legend');
}




var initLegend = function() {
    console.log("initLegend");

    /* Legend Container */
    legendGroup = d3.select("#mapContainer")
        .append("div").attr("id", "legendContainer")
        .append("svg").style("fill", "#FFFFFF")
        .attr("transform", "translate("
        + 200 + ","
        + 200
        + ")")
        .append("g");

    /* Gradiation Init */
    defsLegend = legendGroup.append("defs")
    legendGradientId = "legend-gradient";

    defsLegend.append("linearGradient") .attr("id", legendGradientId)
        .selectAll("stop")
        .data(colorScale.range())
        .enter().append("stop")
        .attr("stop-color", d => d) 
        .attr("offset", (d, i) => `${
          i * 100 / 2 //2 is one less than our array's length
        }%`)

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

        /* Mapbox setup */
        mapObject.addSource('naro', {
            'type': 'geojson',
            'data': dataObjMap
        });
    
        // 3D押出しレイヤー
        mapObject.addLayer({
            'id': 'naro_prob',
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
                'fill-extrusion-vertical-gradient': true
            }
        });


        // 境界線レイヤー
        mapObject.addLayer({
            'id': 'naro_prob_line',
            'type': 'line',
            'source': 'naro',
            'layout': {
                'line-cap': 'round'
            },
            'paint': {
                'line-width': 1,
                'line-color': '#FFF',
                'line-opacity': 0.4
            }
        });

        // 地名テキストレイヤーs
        mapObject.addLayer({
            'id': 'naro_prob_text',
            'type': 'symbol',
            'source': 'naro',
            'layout': {
                'text-field': ['get', 'N03_004'],
                'text-size': 20,
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 0.5,
                'text-justify': 'auto',
                'icon-image': ['get', 'icon']
            },
            'paint': {
                'text-color': "#FFF"
            }
        });
        // ポップアップ
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        /* Mapbox interaction */
        mapObject.on('click', 'naro_prob', function (e) {
            //console.log("local ID: ", e.features[0].properties.N03_007);
            var _selected = e.features[0].properties.N03_007;

            //console.log( "image name: ",dir1[dir1Index] + "_" + dir2[dir2Index] + "_" + dir3[dir3Index] + "_" + _selected + ".png");

            console.log( "assets/data_detail/" + dir1[dir1Index] + "/" + dir2[dir2Index] + "/" + dir3[dir3Index] + "/" + _selected + ".png");


            var lightbox = lity('popup.html');

            window.setTimeout(function(){

                console.log("_selected", _selected);
                
                var iframeElem = document.getElementsByTagName('iframe');
                var iframeDocument = iframeElem[1].contentDocument || iframeElem[1].contentWindow.document;

                var _pElem1 = iframeDocument.getElementsByClassName('kirakirakira')[0];
                _pElem1.textContent = _selected;

            }, 3000);

  

        });

        mapObject.on('mousemove', 'naro_prob', (e) => {

                // console.log(this);

                mapObject.getCanvas().style.cursor = 'pointer';
                console.log("e", e.features[0].properties["N03_007"]);

                var _addressB = e.features[0].properties["N03_007"];



                // 対象自治体の住所を生成
                if (e.features[0].properties["N03_001"]) {
                    var _address_1 = e.features[0].properties["N03_001"];
                } else {
                    var _address_1 = "";
                }

                if (e.features[0].properties["N03_002"]) {
                    var _address_2 = e.features[0].properties["N03_002"];
                } else {
                    var _address_2 = "";
                }

                if (e.features[0].properties["N03_003"]) {
                    var _address_3 = e.features[0].properties["N03_003"];
                } else {
                    var _address_3 = "";
                }

                if (e.features[0].properties["N03_004"]) {
                    var _address_4 = e.features[0].properties["N03_004"];
                } else {
                    var _address_4 = "";
                }
                var _addressA = _address_1 + _address_2 + _address_3 + _address_4;



                // 対象自治体の中心点を取得
                const coordinates = e.features[0].geometry.coordinates.slice();

                var _line = turf.lineString(coordinates[0]);
                var _bbox = turf.bbox(_line);
                var _bboxPolygon = turf.bboxPolygon(_bbox);

                var _lng = (_bboxPolygon.bbox[2] + _bboxPolygon.bbox[0]) /2;
                var _lat = (_bboxPolygon.bbox[3] + _bboxPolygon.bbox[1]) /2;



                // ポップアップを表示
                popup.setLngLat([_lng, _lat]).setHTML(_addressA + "<br />" + _addressB).addTo(mapObject);

        });

        // mapObject.on('mouseenter', 'naro_prob', function () {
        //     mapObject.getCanvas().style.cursor = 'pointer';
        // });
             
        mapObject.on('mouseout', 'naro_prob', function () {
            mapObject.getCanvas().style.cursor = 'auto';
            popup.remove();

        });


        /* Legend setup */

        var _legendTitle = legendGroup.append("text")
            .attr("y", 60)
            .attr("class", "legend-title")
            .style("font-size", "1.4em")
            .style("fill", "#FFFFFF")
            .text("Population growth");

        var _legendGradient = legendGroup.append("rect")
            .attr("y", 60)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            // .style("fill", "#FF0000");
            .style("fill", `url(#${legendGradientId})`);

        
        // Legend Min Value
        let _legendValueMin = legendGroup.selectAll(".legendMinText")
            .data([minData]);

        _legendValueMin.exit()
            .transition()
            .duration(1000)
            .style("font-size", "0rem")
            .remove();

        _legendValueMin.enter()
            .append("text")
            .attr("class", "legendMinText")
            .attr("x", 0)
            .attr("y", 100)
            .merge(_legendValueMin)
            .transition()
            .duration(2000)
            .attr("x", 0)
            .attr("y", 100)
            .attr("text-anchor", "start")
            .text(function(d) {
                return d;
            });
        // Legend Max Value
        let _legendValueMax = legendGroup.selectAll(".legendMaxText")
            .data([maxData]);

        _legendValueMax.exit()
            .transition()
            .duration(1000)
            .style("font-size", "0rem")
            .remove();

        _legendValueMax.enter()
            .append("text")
            .attr("class", "legendMaxText")
            .attr("x", function(d){
                return legendWidth;
            })
            .attr("y", 100)
            .merge(_legendValueMax)
            .transition()
            .duration(2000)
            .attr("x", function(d){
                return legendWidth;
            })
            .attr("y", 100)
            .attr("text-anchor", "end")
            .text(function(d) {
                return d;
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
PubSub.subscribe('init:legend', initLegend);

PubSub.subscribe('load:basemap', loadBasemap);
PubSub.subscribe('load:themedata', loadThemeData);
PubSub.subscribe('draw:map', drawMap);
PubSub.subscribe('update:map', updateMap);

PubSub.subscribe('show:detail', showDetail);
PubSub.subscribe('hide:detail', hideDetail);

PubSub.publish('init:basemap');
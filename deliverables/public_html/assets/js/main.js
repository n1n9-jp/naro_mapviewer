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
 地図設定パラメータ
-------------------- */

/* MapObject */
var mapObject, smallMapObject;

/* Map Tile */
maptileURL = [];
maptileURL[0] = "https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W";
maptileURL[1] = "https://api.maptiler.com/maps/positron/style.json?key=p3yGzZkqo3eCxtEynu6W";

/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXVpY2h5IiwiYSI6ImNrcW43dXA0YTA4eTEyb28yN25jeTN0ZHMifQ.7v7OJoeJXp2fqX5vloX-PQ';

var POI = [
  {
    city: "Tokyo Station",
    longitude: 139.767125,
    latitude: 35.681236,
    zoom: 6,
    pitch: 45,
    bearing: 70,
  },
  {
    city: "NARO",
    longitude: 140.110249,
    latitude: 36.027363,
    zoom: 6,
    pitch: 85,
    bearing: 70,
  }
];



var legendYPos = [22, 45, 70];
var _columnWidth = 0;
var tsukubaHeight = 0;
var _tempGeoJson = [];



/* --------------------
 スケール
-------------------- */

/* Data Scale */
var minDataOrigin = 0.0;
var maxDataOrigin = 100.0;
var dataScaleArray = [];
var _obj1 = {minData: minDataOrigin, maxData: maxDataOrigin};
var _obj2 = {minData: 0.0, maxData: 100.0};
dataScaleArray.push(_obj1);
dataScaleArray.push(_obj2);
var scaleIndex = 0;






/* Color Scale */
var minColor = "#333333";
var maxColor = "#FFFFFF";
// var minColor = "rgba(120, 120, 120, 0.2)";
// var maxColor = "rgba(255, 255, 255, 1.0)";

/* Height Scale */
var minHeight = 0;
var maxHeight = 50000;

// var colorScale = d3.scaleLinear()
//     .domain([minData, maxData])
//     .range([minColor, maxColor]);

var colorScale = d3.scaleLinear()
    .domain([dataScaleArray[scaleIndex].minData, dataScaleArray[scaleIndex].maxData])
    .range([minColor, maxColor]);




/* --------------------
 凡例
-------------------- */
var legendGroup;
var defsLegend;
var legendGradientId = "legend-gradient";
var legendWidth = 200;
var legendHeight = 10;



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
var dataBaseMapSimple;     // Base Map Simple
var dataBaseMapDetailed;     // Base Map Detail
var dataObjTheme;   // Theme Data

/* Swiper UI Probability */
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
        "style": maptileURL[1]
    });



    smallMapObject = new mapboxgl.Map({
        "container": "smallMapLegend",
        "center": [POI[1]["longitude"], POI[1]["latitude"]],
        "zoom": POI[1]["zoom"],
        "minZoom": 6,
        "maxZoom": 16,
        "pitch": POI[1]["pitch"], 
        "minPitch": 0,
        "maxPitch": 85,
        "bearing": POI[1]["bearing"], 
        "hash": true,
        "interactive": true,
        "style": maptileURL[1]
    });



    var _stylecount = 0;
    mapObject.on('styledata', () => {
        _stylecount++;
        if (_stylecount == 2) {
            PubSub.publish('init:nav');
        }
    });

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

        _data = null;



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
    var _scaleItems = d3.select("#swiperVisualizationScale")
        .selectAll("div")
        .data(scaleArray)
        .enter();

    _scaleItems.append("div")
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
        PubSub.publish('update:map');
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
    legendGroup = d3.select("#legendBar")
        .append("div").attr("id", "legendContainer")
        .append("svg").style("fill", "#FFFFFF")
        .attr("transform", "translate("
        + 0 + ","
        + 0
        + ")")
        .append("g");

    /* Gradiation Init */
    defsLegend = legendGroup.append("defs")

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
        // d3.json("assets/data_lib/" + "japanmap.json")
        d3.json("assets/data_lib/" + "JapanMapDetail_light.json"),
        d3.json("assets/data_lib/" + "JapanMapSimple.json")
    ]).then(function (_data) {
        dataBaseMapDetailed = _.cloneDeep(_data[0]);
        dataBaseMapSimple = _.cloneDeep(_data[1]);

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
            dataObjTheme[i]["MuniCode"] = parseInt(dataObjTheme[i]["MuniCode"]);
            dataObjTheme[i]["mean"] = parseFloat(dataObjTheme[i]["mean"]);
            dataObjTheme[i]["sd"] = parseFloat(dataObjTheme[i]["sd"]);

            dataObjTheme[i]["H0"] = parseFloat(dataObjTheme[i]["H0"]);
            dataObjTheme[i]["L0"] = parseFloat(dataObjTheme[i]["L0"]);
        }

        console.log("probArray[probIndex]", probArray[probIndex]);
        _data = null;



        PubSub.publish('draw:map');
    });
}



var drawMap = function() {
    console.log("drawMap");



    /* combine base map& theme data */

    for(var i=0; i<dataBaseMapDetailed.features.length; i++) {

        var _muniid = dataBaseMapDetailed.features[i]["properties"]["N03_007"];

        var _fl = false;
        for(var j=0; j<dataObjTheme.length; j++) {
            if (dataObjTheme[j]["MuniCode"] == _muniid){
                dataBaseMapDetailed.features[i]["properties"]["mean"] = parseFloat(dataObjTheme[j]["mean"]);
                dataBaseMapDetailed.features[i]["properties"]["sd"] = parseFloat(dataObjTheme[j]["sd"]);
                dataBaseMapDetailed.features[i]["properties"]["L0"] = parseFloat(dataObjTheme[j]["L0"]);
                dataBaseMapDetailed.features[i]["properties"]["H0"] = parseFloat(dataObjTheme[j]["H0"]);
                _fl = true;
            }
        }

        if (!_fl){
            dataBaseMapDetailed.features[i]["properties"]["mean"] = 0;
            dataBaseMapDetailed.features[i]["properties"]["sd"] = 0;
            dataBaseMapDetailed.features[i]["properties"]["L0"] = 0;
            dataBaseMapDetailed.features[i]["properties"]["H0"] = 0;
        }
    }
    console.log("dataBaseMapDetailed", dataBaseMapDetailed);



    _tempGeoJson = [];
    for (i=0; i<dataBaseMapDetailed.features.length; i++) {
        // console.log(dataBaseMapDetailed.features[i].properties.N03_004);

        if (dataBaseMapDetailed.features[i].properties.N03_004 == 'つくば市') {
            _tempGeoJson.push(dataBaseMapDetailed.features[i]);
        }
    }
    console.log("_tempGeoJson", _tempGeoJson);
    /* update: scale */

    // d3.select("#txtDir1").text(dir1[dir1Index]);
    // d3.select("#txtDir2").text(dir2[dir2Index]);
    // d3.select("#txtDir3").text(dir3[dir3Index]);
    // d3.select("#txtDir4").text(probArray[probIndex]);


    // colorScale
    //     .domain([minData, maxData])
    //     .range([minColor, maxColor]);

    colorScale = d3.scaleLinear()
        .domain([dataScaleArray[scaleIndex].minData, dataScaleArray[scaleIndex].maxData])
        .range([minColor, maxColor]);



    /* draw: basemap */

    if (fl_firsttime){

        /* Add Source */
        mapObject.addSource('naro', {
            'type': 'geojson',
            'data': dataBaseMapDetailed
        });

        mapObject.addSource('naro_simple', {
            'type': 'geojson',
            'data': dataBaseMapSimple
        });

        smallMapObject.addSource('naro_legend', {
            'type': 'geojson',
            'data': dataBaseMapDetailed
        });



        /* --------------------
            メイン用
        -------------------- */

        // 3D押出しレイヤー
        mapObject.addLayer({
            'id': 'naro_prob',
            'type': 'fill-extrusion',
            'source': 'naro',
            'layout': {},
            'paint': {
                'fill-extrusion-color': [
                    'interpolate', ['linear'],
                    ['get', probArray[probIndex]],
                    // minData, minColor,
                    dataScaleArray[scaleIndex].minData, minColor,
                    dataScaleArray[scaleIndex].maxData, maxColor
                ],
                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['get', probArray[probIndex]],
                    dataScaleArray[scaleIndex].minData, 0,
                    dataScaleArray[scaleIndex].maxData, 50000
                    // minData, 0,
                    // maxData, 50000
                ],
                'fill-extrusion-vertical-gradient': true
            },
            // 'filter': ['==', 'N03_001', '東京都']
        });



        // 境界線レイヤー（広域自治体）
        mapObject.addLayer({
            'id': 'naro_prob_line_simple',
            'type': 'line',
            'source': 'naro_simple',
            'layout': {
                'line-cap': 'round'
            },
            'paint': {
                'line-width': 1,
                'line-color': '#FFF',
                'line-opacity': 1.0
            }
        });



        // 境界線レイヤー（基礎自治体）
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
                'line-opacity': 0.2
            }
        });



        // mapObject.addLayer({
        //     'id': 'naro_prob_line_simple',
        //     'type': 'fill-extrusion',
        //     'source': 'naro_simple',
        //     'layout': {},
        //     'paint': {
        //         // 'fill-extrusion-height': [
        //         //     'interpolate', ['linear'],
        //         //     ['get', probArray[probIndex]],
        //         //     dataScaleArray[scaleIndex].minData, 0,
        //         //     dataScaleArray[scaleIndex].maxData, 50000
        //         //     // minData, 0,
        //         //     // maxData, 50000
        //         // ],
        //         'fill-extrusion-height': 500,        
        //         'fill-extrusion-vertical-gradient': true
        //     }
        // });




        /* --------------------
            凡例用
        -------------------- */

        smallMapObject.setCenter([POI[1]["longitude"], POI[1]["latitude"]]);
        smallMapObject.setPitch(POI[1]["pitch"]);

        // 凡例用3D押出しレイヤー
        smallMapObject.addLayer({
            'id': 'naro_prob_legend',
            'type': 'fill-extrusion',
            'source': 'naro_legend',
            'layout': {},
            'paint': {
                'fill-extrusion-color': [
                    'interpolate', ['linear'],
                    ['get', probArray[probIndex]],
                    // minData, minColor,
                    dataScaleArray[scaleIndex].minData, minColor,
                    dataScaleArray[scaleIndex].maxData, maxColor
                ],
                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['get', probArray[probIndex]],
                    dataScaleArray[scaleIndex].minData, 0,
                    dataScaleArray[scaleIndex].maxData, 50000
                    // minData, 0,
                    // maxData, 50000
                ],
                'fill-extrusion-vertical-gradient': true
            },'filter': ['==', 'N03_004', 'つくば市']
        });


        // 地名テキストレイヤー
        // mapObject.addLayer({
        //     'id': 'naro_prob_text',
        //     'type': 'symbol',
        //     'source': 'naro',
        //     'layout': {
        //         'text-field': ['get', 'N03_004'],
        //         'text-size': 12,
        //         'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        //         'text-radial-offset': 0.5,
        //         'text-justify': 'auto',
        //         'icon-image': ['get', 'icon']
        //     },
        //     'paint': {
        //         'text-color': "#FFF"
        //     }
        // });



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

                // console.log("e", e.features[0].properties);

                mapObject.getCanvas().style.cursor = 'pointer';



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
                var _addressB = e.features[0].properties["N03_007"];



                // 対象自治体の中心点を取得
                const coordinates = e.features[0].geometry.coordinates.slice();
                // console.log("coordinates[0]", coordinates[0]);

                if (coordinates[0].length == 1) {
                    var _line = turf.lineString(coordinates[0][0]);
                } else {
                    var _line = turf.lineString(coordinates[0]);
                }

                var _bbox = turf.bbox(_line);
                var _bboxPolygon = turf.bboxPolygon(_bbox);

                var _lng = (_bboxPolygon.bbox[2] + _bboxPolygon.bbox[0]) /2;
                var _lat = (_bboxPolygon.bbox[3] + _bboxPolygon.bbox[1]) /2;



                // ポップアップを表示
                popup.setLngLat([_lng, _lat]).setHTML(_addressA + "<br />" + _addressB).addTo(mapObject);



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
            popup.remove();

        });



        /* プリント・ダイアログ閉じたあとの挙動 */
        window.addEventListener('afterprint', (event) => {
            console.log('After print');
            d3.selectAll(".sidebar").style("display", "block");
            d3.selectAll("#info4print").style("display", "none");
            d3.select(".mapboxgl-ctrl-top-right").style("display", "block");
        });

        /* プリントボタン設置 & プリント・ダイアログ開いたあとの挙動 */
        document.querySelector('#printBtn').addEventListener('click', () => {
            console.log('print');
            d3.selectAll(".sidebar").style("display", "none");
            d3.selectAll("#info4print").style("display", "block");
            d3.select(".mapboxgl-ctrl-top-right").style("display", "none");

            d3.selectAll("#dir1print").text(dir1[dir1Index]);
            d3.selectAll("#dir2print").text(dir2[dir2Index]);
            d3.selectAll("#dir3print").text(dir3[dir3Index]);
            d3.selectAll("#probprint").text("Probability: " + probLabelArray[probIndex]);
            d3.selectAll("#vizscaleprint").text("Visualization Scale: " + scaleArray[scaleIndex]);

            window.print();
        });



        fl_firsttime = false;
    } else {
        console.log("false");

        /* Legend update */
        

        // mapObject.setPaintProperty('naro_prob', 'fill-extrusion-height', [
        //     'interpolate', 
        //     ['linear'],
        //     ['get', probArray[probIndex]],
        //     minData, 0,
        //     maxData, 50000
        // ]);

        mapObject.getSource('naro').setData(dataBaseMapDetailed);



        /* 一旦updateMapの冒頭をコピペ */
        if (scaleIndex == 0) {

            dataScaleArray[scaleIndex].minData = minDataOrigin;
            dataScaleArray[scaleIndex].maxData = maxDataOrigin;

        } else if (scaleIndex == 1) {

                if (probArray[probIndex] == "L0") {

                    console.log("L0 -----");
                    dataScaleArray[scaleIndex].minData = d3.min(dataObjTheme, function(d){
                        return d["L0"];
                    });
                    dataScaleArray[scaleIndex].maxData = d3.max(dataObjTheme, function(d){
                        return d["L0"];
                    });
            
                } else if (probArray[probIndex] == "H0") {
            
                    console.log("H0 -----");
                    dataScaleArray[scaleIndex].minData = d3.min(dataObjTheme, function(d){
                        return d["H0"];
                    });
                    dataScaleArray[scaleIndex].maxData = d3.max(dataObjTheme, function(d){
                        return d["H0"];
                    });
                }
        }

        colorScale
            .domain([dataScaleArray[scaleIndex].minData, dataScaleArray[scaleIndex].maxData])
            .range([minColor, maxColor]);


        PubSub.publish('update:legend');





    }

    PubSub.publish('update:legend');
    // console.log("dataBaseMapDetailed", dataBaseMapDetailed);
}



var updateMap = function() {
    console.log("updateMap");


//     var minDataOrigin = 0.0;
// var maxDataOrigin = 100.0;



    if (scaleIndex == 0) {

            dataScaleArray[scaleIndex].minData = minDataOrigin;
            dataScaleArray[scaleIndex].maxData = maxDataOrigin;

    } else if (scaleIndex == 1) {

            if (probArray[probIndex] == "L0") {

                console.log("L0 -----");
                dataScaleArray[scaleIndex].minData = d3.min(dataObjTheme, function(d){
                    return d["L0"];
                });
                dataScaleArray[scaleIndex].maxData = d3.max(dataObjTheme, function(d){
                    return d["L0"];
                });
        
            } else if (probArray[probIndex] == "H0") {
        
                console.log("H0 -----");
                dataScaleArray[scaleIndex].minData = d3.min(dataObjTheme, function(d){
                    return d["H0"];
                });
                dataScaleArray[scaleIndex].maxData = d3.max(dataObjTheme, function(d){
                    return d["H0"];
                });
            }
    }



    colorScale
        .domain([dataScaleArray[scaleIndex].minData, dataScaleArray[scaleIndex].maxData])
        .range([minColor, maxColor]);



    mapObject.setPaintProperty(
        "naro_prob",
        'fill-extrusion-height',
            ['interpolate', ['linear'],
            ['get', probArray[probIndex]],
            dataScaleArray[scaleIndex].minData, minHeight,
            dataScaleArray[scaleIndex].maxData, maxHeight]
            // minData, minHeight,
            // maxData, maxHeight]
    );

    smallMapObject.setPaintProperty(
        "naro_prob_legend",
        'fill-extrusion-height',
            ['interpolate', ['linear'],
            ['get', probArray[probIndex]],
            dataScaleArray[scaleIndex].minData, minHeight,
            dataScaleArray[scaleIndex].maxData, maxHeight]
    );


    PubSub.publish('update:legend');
    // d3.select("#txtDir4").text(probArray[probIndex]);
}





var updateLegend = function() {
    console.log("updateLegend");
    console.log("dataScaleArray[scaleIndex]", dataScaleArray[scaleIndex]);


    /* detect Width */
    _columnWidth = document.getElementById("legendCon").offsetWidth -20;
    // var _columnWidth = d3.select("#legendCon").node().getBBox()["width"];
    // console.log("_columnWidth", _columnWidth);

    var _p = _tempGeoJson[0].properties[probArray[probIndex]];
    d3.select("#heightLegend").text("Tsukuba City: " + _p);


    legendText();

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

PubSub.subscribe('draw:map', drawMap); /* データの読み込みが発生するDir1-3の変更時 */
PubSub.subscribe('update:map', updateMap); /* Probability, Visualization Scaleの変更時 */
PubSub.subscribe('update:legend', updateLegend);
PubSub.subscribe('show:detail', showDetail);
PubSub.subscribe('hide:detail', hideDetail);

PubSub.publish('init:basemap');
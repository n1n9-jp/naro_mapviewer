/* --------------------
 Initialize: Variables depends on Environment
-------------------- */

/* MVT path */
//var urlThemeDomain = 'http://127.0.0.1:8887/mvt/gd/';
var urlThemeDomain = 'https://n1n9-jp.github.io/mvt/gd/';    

//var urlBuildingDomain = 'http://127.0.0.1:8887/mvt/tileset/';
var urlBuildingDomain = 'https://n1n9-jp.github.io/mvt/tileset/';



/* font-size */
// document.getElementById("siteName").style.fontSize = "1em";
// var lineNameFontSize = "1em";
// var cityNameFontSize = "3em";


/* API token */
mapboxgl.accessToken = 'pk.eyJ1IjoieXlhemFraSIsImEiOiJjbTVxZzhrdmMwYmplMnFvazc2bHhnYnJzIn0.3_IEtaI7ZSFcRiaQfZaL_Q';





/* --------------------
 Initialize: Variables
-------------------- */

/* MODE */
var bool_auto = true; //AutoPilot or Interactive

var flyIndex = 0;

/* POI for TopPage */
const POI = [
    { "city": "Tokyo Station", "longitude": 139.767125, "latitude": 35.681236, "zoom": 12, "bearing": 0 },
    { "city": "Sky Tree", "longitude": 139.8107, "latitude": 35.710063, "zoom": 12, "bearing": 0 },
    { "city": "Tokyo Tower",   "longitude": 139.745433 , "latitude": 35.658581, "zoom": 12, "bearing": 0 },
    { "city": "Asakusa-Mon", "longitude": 139.797585, "latitude": 35.714407, "zoom": 12, "bearing": 0 },
    { "city": "Roppongi Hills",   "longitude":  139.730077, "latitude": 35.660238, "zoom": 12, "bearing": 0 },
    { "city": "Shinjuku Station",   "longitude": 139.700571, "latitude": 35.689607, "zoom": 12, "bearing": 0 },
    { "city": "Shibuya Station", "longitude": 139.701636, "latitude": 35.658034, "zoom": 12, "bearing": 0 },
    { "city": "Kitijoji Station",   "longitude": 139.579809 , "latitude": 35.703149, "zoom": 12, "bearing": 0 }
];
// var buildingKind = [111,112,113,114,121,122,123,124,125,131,132,141,142,143,150];

/* ファイルの読み込みを年度で管理する */
// var yearNameArray = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
var yearNameArray = ["2016"];
var yearIndex = 0;
  
/* 対象地域 */
//   var prefNameArray = ["Saitama","Chiba","Tokyo","Kanagawa"];
var prefNameArray = ["Tokyo"];

/* 多様性指数の変数 */
// var diversArray = ["H_rl","B_rl","H_sub","B_sub"]
var diversArray = ["H_sub","B_sub"]
var diversLabelArray = ["Shannon-weaver","Simpson"]
var diversIndex = 0;

/* モード */
var modesArray = ["auto","manual"]
var modesLabelArray = ["Auto Pilot","Interactive"]
var modesIndex = 0;

/* 多様性指数のカラー */
var divValueArray = new Array();
divValueArray[0] = [0.0000,0.3365,0.9198,1.4271,1.9357];
divValueArray[1] = [0.000,1.000,2.286,4.285,6.914];
var divColorArray = new Array();
divColorArray[0] = ['#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d'];
divColorArray[1] = ['#f1eef6','#d7b5d8','#df65b0','#dd1c77','#980043']

// var diversityMinMax;
// var minValue;
// var maxValue;

/* データの入れ物 */
var themeDataLayers = new Array();
var osmDataLayers = new Array();

/* コースデータ */
var courseArray = new Array();
var courseNameArray = ["京王線","東急世田谷線","東急東横線","JR山手線"];
var courseID;

/* データの読み込み管理 */
var dataPreLoad = new Array();
for (var i=0; i<yearNameArray.length;i++) {
    dataPreLoad[i] = false;
}

/* Mapbox/MapLibre */
var mapObject;
var bool_osm = true;

/* Swiper UI */
var swiperDivers;
var swiperModes;

/* TimeOut ID */
// var timer_opening;
// var timerIDArray = new Array();



//タイマー初期設定

// function timer_func(){
//     // Interactiveモードの終了
//     console.log("INTERACTIVE MODE end");
//     bool_auto = true;
//     PubSub.publish('goback:top');

// };
// // var time_limit=10*60*1000;
// var time_limit = 3*60*1000;
// var timer_id;



$('body').on('mousemove mousedown',function(e){

    // インタラクティブモードなら...
    // if ((!bool_auto) && (e.target.id != 'swiper-button-next-modes'))
    // {
    //     clearTimeout(timer_id);
    //     timer_id = setTimeout(timer_func, time_limit);

    //     // Swiper UIを基に戻す
    //     // bool_auto = true;
    //     // modesIndex = 0;
    //     // swiperModes.slideTo(modesIndex);

    //     console.log("Mouse Moved!");
    // } 
});



var loadTopPage = function() {

    console.log("loadTopPage");


    /*--- サイズを指定 ---*/
    //ひとつ前の別の場所へ移動させる


    // bgTopCover
    // $('.btnStart').click(function(){

        // START

        /* Timer */
        // clearTimeout(timer_opening);
        // courseID = this.id;

        /* UI処理 */
        // $('#bgTopCover').toggleClass('-visible');
        // document.getElementById("topMap").style.visibility = "hidden";

        // document.getElementById("btnEnd").style.display = "block";
        // document.getElementById("btnDescription").style.display = "none";

        // $('#btnDescription').removeClass('-visible');
        // document.getElementById("btnDescription").innerText = "解説をみる";

        //document.getElementsByClassName("swipers").style.visibility = "visible";
        // $('.swipers').css({'visibility':'visible'});

        
    // });

    var _topPOInum = Math.floor(Math.random() * POI.length);

    // mapTopObject = new mapboxgl.Map({
    //     "container": "topMap",
    //     "center": [POI[_topPOInum]["longitude"], POI[_topPOInum]["latitude"]],
    //     "zoom": 12,
    //     "pitch": 0, 
    //     "bearing": 0, 
    //     "hash": true,
    //     "interactive": false,
    //     "style": 'https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W',
    // });

    // mapTopObject.on('style.load', function () {

        //console.log("mapTopObject load");

        // var fileName = '2016';
        // // var fileName = yearNameArray[0] + '/' + prefNameArray[0];
        // // var urlThemeData = urlThemeDomain + fileName + '/{z}/{x}/{y}.pbf'
        // var urlBuildingData = urlBuildingDomain + fileName + '/{z}/{x}/{y}.pbf'
        // //console.log(urlBuildingData);

        // mapTopObject.addSource(fileName + '_top', {
        //     'type': 'vector',
        //     'tiles': [
        //         urlBuildingData
        //     ],
        //     // "zoom": 12,
        // });


        // mapTopObject.addLayer({
        //     "id": fileName + '_top',
        //     "type": "fill",
        //     "source": fileName + '_top',
        //     "source-layer": "tokyobuilding",
        //     "zoom": 12,
        //     "pitch": 0,
        //     "paint": {
        //         //'fill-color': '#FFFFFF',
        //         'fill-color':
        //         {
        //             property: 'BV_6',
        //             type: 'interval',
        //             stops: [
        //                 // [_run, "#FF0000"],
        //                 // [111, "#FF0000"],
        //                 // [113, "#FF00FF"],
        //                 [111,'#1f77b4'], //官公庁施設
        //                 [112,'#aec7e8'], //教育文化施設
        //                 [113,'#ff7f0e'], //厚生医療施設
        //                 [114,'#ffbb78'], //供給処理施設
        //                 [121,'#2ca02c'], //事務所建築物
        //                 [122,'#98df8a'], //専用商業施設
        //                 [123,'#d62728'], //住商併用建物
        //                 [124,'#ff9896'], //宿泊・遊興施設
        //                 [125,'#9467bd'], //スポーツ・興行施設
        //                 [131,'#c5b0d5'], //独立住宅
        //                 [132,'#8c564b'], //集合住宅
        //                 [141,'#c49c94'], //専用工場
        //                 [142,'#e377c2'], //住居併用工場
        //                 [143,'#f7b6d2'], //倉庫運輸関係施設
        //                 [150,'#7f7f7f'], //農林漁業施設
        //             ]
        //         },
        //         'fill-opacity': 1.0
        //     }
        // });

    //     PubSub.publish('anime:top');

    // });

    /*--- 次を呼び出し ---*/
    PubSub.publish('init:basemap');

};



// var topAnimation = function() {

//         console.log("topAnimation");

//         function opening_motion() {

//             var opacityArray = new Array();

//             // #1
//             var _run = Math.floor(Math.random() * 15);
//             for (i=0; i<15; i++) {
//                 if (i==_run) {
//                     opacityArray[i] = 1.0;
//                 } else {
//                     opacityArray[i] = 0.4;
//                 }
//             };



//             mapTopObject.setPaintProperty(
//                 '2016_top', 
//                 'fill-opacity', 
//                 {
//                     property: 'BV_6',
//                     type: 'interval',
//                     stops: [
//                         // [_run, "#FF0000"],
//                         // [111, "#FF0000"],
//                         // [113, "#FF00FF"],
//                         [111,opacityArray[0]], //官公庁施設
//                         [112,opacityArray[1]], //教育文化施設
//                         [113,opacityArray[2]], //厚生医療施設
//                         [114,opacityArray[3]], //供給処理施設
//                         [121,opacityArray[4]], //事務所建築物
//                         [122,opacityArray[5]], //専用商業施設
//                         [123,opacityArray[6]], //住商併用建物
//                         [124,opacityArray[7]], //宿泊・遊興施設
//                         [125,opacityArray[8]], //スポーツ・興行施設
//                         [131,opacityArray[9]], //独立住宅
//                         [132,opacityArray[10]], //集合住宅
//                         [141,opacityArray[11]], //専用工場
//                         [142,opacityArray[12]], //住居併用工場
//                         [143,opacityArray[13]], //倉庫運輸関係施設
//                         [150,opacityArray[14]], //農林漁業施設
//                     ]
//                 }
//             );
    
//             timer_opening = setTimeout(opening_motion, 2000);
//             console.log("opening_motion");
//         }
//         opening_motion();

// }



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
        "style": 'assets/data/style.json'
        // "style": 'https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W',
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
            PubSub.publish('init:nav');

        });
    
    PubSub.publish('ui:check');
};



var initNav = function() {

    console.log("initNav");

    /* Diversity Var Slider */
    var diversItems = d3.select("#swiperDivers")
        .selectAll("div")
        .data(diversArray)
        .enter();

    diversItems.append("div")
        .attr('class', function () {
            return "swiper-slide";
        })
        .text(function (d, i) {
            //return d;
            return diversLabelArray[i];
        });
    // d3.selectAll(".swiper-slide").append('div').text('指数');

    swiperDivers = new Swiper('#swiper-container-divers', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-divers',
            prevEl: '#swiper-button-prev-divers',
        },
    });

    swiperDivers.on('slideChange', function () {
        diversIndex = swiperDivers.activeIndex;
        PubSub.publish('draw:thememapDivers');
    });




    /* Mode Slider */
    var modesItems = d3.select("#swiperModes")
    .selectAll("div")
    .data(modesArray)
    .enter();

    modesItems.append("div")
        .attr('class', function () {
            return "swiper-slide";
        })
        .text(function (d, i) {
            //return d;
            return modesLabelArray[i];
        });
    // d3.selectAll(".swiper-slide").append('div').text('指数');

    swiperModes = new Swiper('#swiper-container-modes', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-modes',
            prevEl: '#swiper-button-prev-modes',
        },
    });
    
    swiperModes.on('slideChange', function () {

        modesIndex = swiperModes.activeIndex;
        //console.log("modesIndex", modesIndex);

        if (modesIndex == 0) {

            // to Auto Mode
            // console.log("to Auto Mode");

            // bool_auto = true;
            // clearTimeout(timer_id);

            /* diversity OFF */
            themeDataLayers.length = 0;

            for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
                if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
                    themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
                }
            }

            for (var i = 0; i < themeDataLayers.length; i++) {
                mapObject.setLayoutProperty(
                    themeDataLayers[i],
                    'visibility',
                    'none'
                );
            }


            PubSub.publish('animate:to');

        } else if (modesIndex == 1) {

            // to Interactive Mode
            // console.log("to Interactive Mode");

            // bool_auto = false;
            // timer_id = setTimeout(timer_func, time_limit);

            // for (i=0; i<timerIDArray.length; i++) {
            //     clearTimeout( timerIDArray[i] );
            // }



            /* diversity view adjust */
            themeDataLayers.length = 0;
            for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
                if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
                    themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
                }
            }
            for (var i = 0; i < themeDataLayers.length; i++) {
                mapObject.setLayoutProperty(
                    themeDataLayers[i],
                    'visibility',
                    'visible'
                );
            }
            mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-color', '#f5e9dc');
            mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-opacity', 1.0);

        };

        //PubSub.publish('draw:thememapDivers');
    });



    /*--- 次を呼び出し ---*/
    PubSub.publish('init:mapui');

};



var initMapUI = function() {

    console.log("initMapUI");

    /*--- 次を呼び出し ---*/
    PubSub.publish('init:toggleui');
};



var initToggleUI = function() {

    console.log("initToggleUI");


    jQuery(function($){ 

        $('#btnDescription').click(function(){

            $('#bgDescription').toggleClass('-visible');

            if($('#bgDescription').hasClass('-visible')){
                document.getElementById("btnDescription").innerText = "解説をとじる";
            } else {
                document.getElementById("btnDescription").innerText = "解説をみる";
            }
        });
    });


    /*--- 次を呼び出し ---*/
    PubSub.publish('load:stationdata');
};



var loadStationData = function() {

    console.log("loadStationData");

    Promise.all([
        d3.csv("assets/data/line_keio.csv"),
        d3.csv("assets/data/line_setagaya.csv"),
        d3.csv("assets/data/line_toyoko.csv"),
        d3.csv("assets/data/line_yamanote.csv"),

        ]).then(function (_data) {

            for (i=0; i<4; i++) {

                _data[i].forEach(function (d) {
                    d.lon = parseFloat(d["lon"]);
                    d.lat = parseFloat(d["lat"]);
                });

                courseArray[i] = _.cloneDeep(_data[i]);
                _data[i] = null;
            }

    });


    /*--- 次を呼び出し ---*/
    PubSub.publish('load:diverscsv');
};



var loadDivers = function() {

    console.log("loadDivers");

    PubSub.publish('draw:buildingmap');
}



var drawBuildingMap = function() {

    console.log("drawBuildingMap");



    /* --------------------
    Tokyo Buildings
    -------------------- */
    // var fileName = '2016';

    // var urlBuildingData = urlBuildingDomain + fileName + '/{z}/{x}/{y}.pbf'
    // //console.log("urlBuildingData", urlBuildingData);

    // /* データソース追加 */
    // mapObject.addSource('tobuil', {
    //     'type': 'vector',
    //     'tiles': [
    //         urlBuildingData
    //     ],
    //     "minzoom": 12,
    //     "maxzoom": 16,
    //     "attribution": ''
    // });

    // /* レイヤー追加 */
    // /* fill-extrusion */
    // mapObject.addLayer({
    //     "id": 'building_tokyo',
    //     "type": "fill-extrusion",
    //     "source": 'tobuil',
    //     "source-layer": "tokyobuilding",
    //     "minzoom": 12,
    //     "maxzoom": 16,
    //     "paint": {
    //         'fill-extrusion-color': {
    //         property: "BV_6",
    //         type: 'interval',
    //         stops: [
    //             [111,'#f5e9dc'], //官公庁施設
    //             [112,'#f5e9dc'], //教育文化施設
    //             [113,'#f5e9dc'], //厚生医療施設
    //             [114,'#f5e9dc'], //供給処理施設
    //             [121,'#f5e9dc'], //事務所建築物
    //             [122,'#f5e9dc'], //専用商業施設
    //             [123,'#f5e9dc'], //住商併用建物
    //             [124,'#f5e9dc'], //宿泊・遊興施設
    //             [125,'#f5e9dc'], //スポーツ・興行施設
    //             [131,'#f5e9dc'], //独立住宅
    //             [132,'#f5e9dc'], //集合住宅
    //             [141,'#f5e9dc'], //専用工場
    //             [142,'#f5e9dc'], //住居併用工場
    //             [143,'#f5e9dc'], //倉庫運輸関係施設
    //             [150,'#f5e9dc'], //農林漁業施設
    //         ],
    //         },
    //         'fill-extrusion-height': 10,
    //         'fill-extrusion-opacity': 0.9,
    //     }
    //     });



    //     mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-height', [
    //         'interpolate', 
    //         ['linear'],
    //         ['zoom'], //0-61階
    //         15, 0,
    //         // 15.9, 300
    //         // 15.9, ['get', 'BV_3'] * 100
    //         15.9, ["*", ['get', 'BV_3'], 10]
    //     ]);



    //     var _tempArray = new Array();
    //     for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
    //         _tempArray.push(mapObject.getStyle().layers[i]["id"]);
    //     }
    
    
        /*--- 次を呼び出し ---*/
        PubSub.publish('draw:thememapYear');

};




var drawThemeMapByYear = function() {

    console.log("drawThemeMapByYear");

    // レイヤーを全部非表示にする
    // 実行が早すぎてうまくワークしないので一旦オフに
    // PubSub.publish('hide:theme');


    /* すでに読み込み済か判定 */
    if (dataPreLoad[yearIndex]) {

        // すでに読み込み済の場合

        // レイヤーを表示する
        for (var i = 0; i < mapObject.getStyle().layers.length; i++) {

            if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {

                mapObject.setLayoutProperty(
                mapObject.getStyle().layers[i]["id"],
                'visibility',
                'visible'
                );

            }
        }

    } else {

        // 読み込み済ではない場合

        // データを読み込みレイヤーを表示する
        for (var i=0; i<prefNameArray.length; i++) {

            // ファイル名を生成
            var fileName = yearNameArray[yearIndex] + '/' + prefNameArray[i];
            var urlThemeData = urlThemeDomain + fileName + '/{z}/{x}/{y}.pbf'

            //console.log("urlName", urlName);

            // データソース追加
            mapObject.addSource(fileName, {
                'type': 'vector',
                'tiles': [
                    urlThemeData
                ],
                "minzoom": 12,
                "maxzoom": 16,
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
                "source-layer": "gd",
                "minzoom": 12,
                "maxzoom": 16,
                "paint": {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', diversArray[diversIndex]],
                        divValueArray[diversIndex][0],
                        divColorArray[diversIndex][0],
                        divValueArray[diversIndex][1],
                        divColorArray[diversIndex][1],
                        divValueArray[diversIndex][2],
                        divColorArray[diversIndex][2],
                        divValueArray[diversIndex][3],
                        divColorArray[diversIndex][3],
                        divValueArray[diversIndex][4],
                        divColorArray[diversIndex][4],
                        ],
                    'fill-opacity': 1.0
                }
            });




        } // forLoop

        dataPreLoad[yearIndex] = true;
        PubSub.publish('hide:theme');
    }

};



var drawThemeMapByDivers = function() {

    console.log("drawThemeMapByDivers");

    themeDataLayers.length = 0;
    for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
        if (mapObject.getStyle().layers[i]["id"].startsWith('20')) {
        themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
        }
    }
    console.log("themeDataLayers-2", themeDataLayers);



    for (var i = 0; i < themeDataLayers.length; i++) {



        /* --------------------
        fill-extrusion
        -------------------- */

        mapObject.setPaintProperty(
            themeDataLayers[i], 
            'fill-color', 
            {
            property: diversArray[diversIndex],
            type: 'interval',
            stops: [
                [divValueArray[diversIndex][0], divColorArray[diversIndex][0]],
                [divValueArray[diversIndex][1], divColorArray[diversIndex][1]],
                [divValueArray[diversIndex][2], divColorArray[diversIndex][2]],
                [divValueArray[diversIndex][3], divColorArray[diversIndex][3]],
                [divValueArray[diversIndex][4], divColorArray[diversIndex][4]]
            ],
            }
        );

    } // forLoop
};



var UICheck = function() {

    // OSS/Diversityの切り替え、最初のスイッチを入れる

    //終了ボタン押下時
    //END
    // document.getElementById("btnEnd").onclick = function() {

    //     console.log("btnEnd clicked.");

    //     PubSub.publish('goback:top');

    // }



    // bool_auto = true...AutoPilot Mode
    // if (bool_auto) {
    //     PubSub.publish('animate:to');
    // } else {

    // };

    mapObject.moveLayer('poi-label');
}





var animateTo = function() {

    //console.log("animateTo");


    // function delayedCall(id, second, callBack){
    //     timerIDArray[id] = setTimeout(callBack, second * 1000);
    // }



    // delayedCall(0, 1, function(){

    //     document.getElementById("lineName").innerHTML = courseNameArray[courseID];
    //     document.getElementById("lineName").style.fontSize = lineNameFontSize;

    //     document.getElementById("cityName").innerHTML = courseArray[courseID][flyIndex]["station_name"];
    //     document.getElementById("cityName").style.fontSize = cityNameFontSize;

    //     // console.log("bbb", courseArray[courseID][flyIndex]["lon"]);
    //     $("#filter").addClass("blurOff");

        mapObject.flyTo({
            center: [ courseArray[courseID][flyIndex]["lon"], courseArray[courseID][flyIndex]["lat"] ],
            speed: 0.2,
            curve: 1,
            zoom: 15.9,
            pitch: 60,
            // maxDuration: 5000,
            bearing: 0
        });

    //     hideLayer('poi-label');
    //     // hideLayer('airport-label');

    //     mapObject.on('moveend', function(e){
    //         showLayer('poi-label');
    //         // showLayer('airport-label');
    //     });

    // });



    // delayedCall(1, 15, function(){
    //     console.log("15秒後");

    //     mapObject.easeTo({
    //         pitch: 0,
    //         zoom:14.9
    //     });

    //     $("#filter").removeClass("blurOff");

    //     mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-color', '#FFF');
    //     mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-opacity', 0.3);

    //     themeDataLayers.length = 0;
    //     for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
    //         if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
    //             themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
    //         }
    //     }
    //     for (var i = 0; i < themeDataLayers.length; i++) {
    //         mapObject.setLayoutProperty(
    //             themeDataLayers[i],
    //             'visibility',
    //             'visible'
    //         );
    //     }

    // });



    // delayedCall(2, 30, function(){

    //     console.log("30秒後");

    //     $("#filter").addClass("blurOff");
    //     // showLayer('poi-label');
    //     // showLayer('airport-label');

    //     mapObject.easeTo({
    //         pitch: 60,
    //         zoom: 15.9
    //     });

    //     mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-color', '#f5e9dc');
    //     mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-opacity', 1.0); 

    //     themeDataLayers.length = 0;
    //     for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
    //         if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
    //             themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
    //         }
    //     }
    //     for (var i = 0; i < themeDataLayers.length; i++) {
    //         mapObject.setLayoutProperty(
    //             themeDataLayers[i],
    //             'visibility',
    //             'none'
    //         );
    //     }

    // });



    // delayedCall(3, 33, function(){

    //     console.log("33秒後");

    //     flyIndex++;

    //     if (flyIndex == courseArray[courseID].length) {

    //         PubSub.publish('goback:top');

    //     } else {

    //         if (bool_auto) {
    //             PubSub.publish('animate:to');
    //         } else {
    //             for (i=0; i<timerIDArray.length; i++) {
    //                 clearTimeout( timerIDArray[i] );
    //             }
    //         }
    //     }
    // }); 



    // function showLayer(layerid) {
    //     mapObject.setLayoutProperty(
    //         layerid,
    //         'visibility',
    //         'visible'
    //     );
    // }

    // function hideLayer(layerid) {
    //     mapObject.setLayoutProperty(
    //         layerid,
    //         'visibility',
    //         'none'
    //     );
    // }





    /*--- 次を呼び出し ---*/
    // PubSub.publish('init:basemap');

};




var detailToTop = function() {

    console.log("detailToTop");

    //flyIndex初期化
    flyIndex = 0;

    //タイマーリセット
    for(i=0; i<timerIDArray.length; i++) {
        clearTimeout( timerIDArray[i] );
    }

    //テーマデータの非表示
    themeDataLayers.length = 0;
    for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
        if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
            themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
        }
    }
    console.log("themeDataLayers", themeDataLayers);
    for (var i = 0; i < themeDataLayers.length; i++) {
        mapObject.setLayoutProperty(
            themeDataLayers[i],
            'visibility',
            'none'
        );
    }

    //建物データの描画をデフォルトに
    mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-color', '#f5e9dc');
    mapObject.setPaintProperty('building_tokyo', 'fill-extrusion-opacity', 1.0); 

    $("#filter").addClass("blurOff");

    //トップページ用地図スタイル & 再度アニメ
    var _topPOInum = Math.floor(Math.random() * POI.length);
    mapTopObject.easeTo({
        "pitch": 0,
        "zoom": 12,
        "bearing": 0,
        "center": [POI[_topPOInum]["longitude"], POI[_topPOInum]["latitude"]],
    });

    //画面表示の制御
    $('#bgTopCover').toggleClass('-visible');
    document.getElementById("topMap").style.visibility = "visible";
    document.getElementById("btnEnd").style.display = "none";
    document.getElementById("btnDescription").style.display = "block";

    //スライダーUIの制御
    //document.getElementsByClassName("swipers").style.visibility = "none";
    $('.swipers').css({'visibility':'hidden'});
    swiperModes.slideTo(0);

    PubSub.publish('anime:top');
};







var showThemeLayers = function() {

    console.log("showThemeLayers");

    /* OSM OFF */
    osmDataLayers.length = 0;

    for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
        if (mapObject.getStyle().layers[i]["id"].startsWith("building_")) {
            osmDataLayers.push(mapObject.getStyle().layers[i]["id"]);
        }
    };

    for (var i = 0; i < osmDataLayers.length; i++) {
        mapObject.setLayoutProperty(
            osmDataLayers[i],
            'visibility',
            'none'
        );
    };


    
    /* diversity ON */
    themeDataLayers.length = 0;

    for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
        if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
            themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
        }
    }

    for (var i = 0; i < themeDataLayers.length; i++) {
        mapObject.setLayoutProperty(
            themeDataLayers[i],
            'visibility',
            'visible'
        );
    }

};




var hideAllThemeLayers = function() {

    console.log("hideAllThemeLayers");


    /* OSM ON */
    osmDataLayers.length = 0;

    for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
        if (mapObject.getStyle().layers[i]["id"].startsWith("building_")) {
            osmDataLayers.push(mapObject.getStyle().layers[i]["id"]);
        }
    };

    for (var i = 0; i < osmDataLayers.length; i++) {
        mapObject.setLayoutProperty(
            osmDataLayers[i],
            'visibility',
            'visible'
        );
    };


    
    /* diversity OFF */
    themeDataLayers.length = 0;

    for (var i = 0; i < mapObject.getStyle().layers.length; i++) {
        if (mapObject.getStyle().layers[i]["id"].startsWith(yearNameArray[yearIndex])) {
            themeDataLayers.push(mapObject.getStyle().layers[i]["id"]);
        }
    }

    for (var i = 0; i < themeDataLayers.length; i++) {
        mapObject.setLayoutProperty(
            themeDataLayers[i],
            'visibility',
            'none'
        );
    }

};




PubSub.subscribe('load:toppage', loadTopPage);
// PubSub.subscribe('anime:top', topAnimation);
PubSub.subscribe('init:basemap', initBaseMap);

PubSub.subscribe('init:nav', initNav);
PubSub.subscribe('init:mapui', initMapUI);
PubSub.subscribe('init:toggleui', initToggleUI);

PubSub.subscribe('load:stationdata', loadStationData);
PubSub.subscribe('load:diverscsv', loadDivers);
PubSub.subscribe('draw:buildingmap', drawBuildingMap);
PubSub.subscribe('draw:thememapYear', drawThemeMapByYear);
PubSub.subscribe('draw:thememapDivers', drawThemeMapByDivers);

PubSub.subscribe('ui:check', UICheck);

PubSub.subscribe('show:theme', showThemeLayers);
PubSub.subscribe('hide:theme', hideAllThemeLayers);
PubSub.subscribe('animate:to', animateTo);
PubSub.subscribe('goback:top', detailToTop);

PubSub.publish('load:toppage');
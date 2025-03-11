/* --------------------
　地図設定パラメータ
-------------------- */

/* MapObject */
var mapObject;
var minZoomLevel = 4;
var maxZoomLevel = 16;

/* Map Tile */
var maptileURL = [];
maptileURL[0] = "https://api.maptiler.com/maps/positron/style.json?key=p3yGzZkqo3eCxtEynu6W";
maptileURL[1] = "https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W";
var maptileIndex = 0;

var POI = [
  {
    city: "Tokyo Station",
    longitude: 139.767125,
    latitude: 35.681236,
    zoom: minZoomLevel,
    pitch: 45,
    bearing: 0,
  },
  {
    city: "NARO",
    longitude: 140.110249,
    latitude: 36.027363,
    zoom: minZoomLevel,
    pitch: 75,
    bearing: 0,
  }
];



/* ------------------------------
　データ保存
------------------------------ */

/* FilePath */
var dir1=[], dir2=[], dir3=[];
var dir1Index = 0;
var dir2Index = 0;
var dir3Index = 0;

/* Data Object */
var dataBaseMapSimple;     // Base Map Simple
var dataBaseMapDetailed;     // Base Map Detail
var dataObjTheme;   // Theme Data
var dataObjThemeFiltered;   // Theme Data Filtered



/* --------------------
　スケール
-------------------- */

/* Data Scale */
var _obj1 = {minData: 0.0, maxData: 300.0};
var minDataFixed = 0.0;
var maxDataFixed = 300.0;
var _obj2 = {minData: minDataFixed, maxData: maxDataFixed};
var dataScaleArray = [];
dataScaleArray.push(_obj1);
dataScaleArray.push(_obj2);
var scaleIndex = 0;
// 0 の場合は、固定値の最小値と最大値
// 1 の場合は、テーマデータ内の実際の最小値と最大値

/* Color Scale */
var minColor = "#333333";
var maxColor = "#FFFFFF";
var nullColor = "#c3c7c9";
var colorScale = d3.scaleLinear()
    .domain([dataScaleArray[scaleIndex].minData, dataScaleArray[scaleIndex].maxData])
    .range([minColor, maxColor]);

/* Height Scale */
var minHeight = 0;
var maxHeight = 50000;



/* ------------------------------
　データの変更
------------------------------ */

var varList = [];
var varListRemove = ['Year', 'MuniCode'];
var valueNameArray = []
var colorIndex = 0;
var depthIndex = 0;

var yearArray = new Array();
var yearIndex = 0;



/* ------------------------------
　ナビゲーション
------------------------------ */

// 各navボタンの取得（ID指定）
const dataLink = document.getElementById("datachange");
const vizLink = document.getElementById("vizchange");
const navLinks = [dataLink, vizLink];
var selectedNav = "";



/* ------------------------------
　可視化の変更
------------------------------ */

/* Swiper UI Visualization Scale */
var scaleArray = ["Relative","Absolute"]
var scaleIndex = 0;

/* Swiper UI 2d3d Change */
var d23Array = ["3D","2D"]
var d23ArrayIndex = 0;

/* Flag */
var fl_firsttime = true;
var fl_map = "";
// 新規にマップを描画する必要がある場合は "drawMap"
// 既存のマップを更新する場合は "updateMap"



/* ------------------------------
　スライダー
------------------------------ */

// 外側コンテナとパネルの取得
const slideOverContainer = document.getElementById("slideOverContainer");
const sidepanel = document.getElementById("sidepanel");
const closeButton = sidepanel ? sidepanel.querySelector('button[type="button"]') : null;

// slider内のコンテンツの取得
const contentTitle = sidepanel ? sidepanel.querySelector("#slide-over-title") : null;
const contentContainer = sidepanel ? sidepanel.querySelector(".slider-content") : null;



/* --------------------
　凡例
-------------------- */
var legendGradientId = "legend-gradient";
var legendOuterWidth = 380;  // 凡例SVG全体の横幅
var legendOuterHeight = 60;  // 凡例SVG全体の高さ
var legendBarWidth = 100;    // グラデーションバーの幅
var legendBarHeight = 10;    // グラデーションバーの高さ
var legendWidthMargin = (legendOuterWidth - legendBarWidth)/2;



/* ------------------------------
　関数
------------------------------ */

var initBaseMap = function() {
    console.log("initBaseMap");

    mapObject = new maplibregl.Map({
        "container": "mapContainer",
        "center": [POI[0]["longitude"], POI[0]["latitude"]],
        "zoom": POI[0]["zoom"],
        "minZoom": minZoomLevel,
        "maxZoom": maxZoomLevel,
        "pitch": POI[0]["pitch"], 
        "minPitch": 0,
        "maxPitch": 85,
        "bearing": POI[0]["bearing"], 
        "hash": true,
        "interactive": true,
        "style": maptileURL[maptileIndex]
    });

    var _stylecount = 0;
    mapObject.on('styledata', () => {
        _stylecount++;
        if (_stylecount == 2) {
            PubSub.publish('load:filelist');
        }
    });



    mapObject.on('pitchend', () => {
        if (d23ArrayIndex === 1 && mapObject.getPitch() !== 0) {
            mapObject.setPitch(0);
        }
    });
}


var loadFileList = function() {
    console.log("loadFileList");

    Promise.all([
        d3.csv("assets/data_lib/filelist.csv")
    ]).then(function (_data) {

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

        PubSub.publish('init:dataslider');
    });
}


var initDataSlider = function() {
    console.log("initDataSlider");



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
        dir3Index = e.activeIndex;
        PubSub.publish('load:themedata');
    });

    _data = null;

    PubSub.publish('init:mapui');
}

  

var initMapUI = function() {
    console.log("initMapUI");

    var _nav = new maplibregl.NavigationControl();
    mapObject.addControl(_nav, 'top-right');



    PubSub.publish('init:legend');
}



var initLegend = function() {
    console.log("initLegend");

    // すでにある要素をクリア
    d3.select("#legendBar").selectAll("*").remove();

    // SVG を作成
    var svg = d3.select("#legendBar")
        .append("svg")
        .attr("id", "legendSvg")
        .attr("width", legendOuterWidth)
        .attr("height", legendOuterHeight);

    // グラデーション定義
    var defs = svg.append("defs");
    var gradient = defs.append("linearGradient")
        .attr("id", legendGradientId)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", minColor);
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", maxColor);

    // グラデーションバーの位置（例：少し右へ寄せる）
    var barX = legendWidthMargin;
    var barY = 26;

    // グラデーションバー本体
    svg.append("rect")
        .attr("x", barX)
        .attr("y", barY)
        .attr("width", legendBarWidth)
        .attr("height", legendBarHeight)
        .style("fill", "url(#" + legendGradientId + ")");

    // バー左側に最小値(右揃え)
    var minTextX = barX - 5;
    var minTextY = barY + legendBarHeight / 2;

    svg.append("text")
        .attr("id", "legendMinText")
        .attr("x", minTextX)
        .attr("y", minTextY)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(dataScaleArray[scaleIndex].minData);

    // バー右側に最大値(左揃え)
    var maxTextX = barX + legendBarWidth + 5;
    var maxTextY = barY + legendBarHeight / 2;

    svg.append("text")
        .attr("id", "legendMaxText")
        .attr("x", maxTextX)
        .attr("y", maxTextY)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(dataScaleArray[scaleIndex].maxData);

    PubSub.publish('load:basemap');
};



var loadBasemap = function() {
    console.log("loadBasemap");

    Promise.all([
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

        varList = _data[0].columns;
        valueNameArray = _.difference(varList, varListRemove);
        console.log(valueNameArray);

        /* 自治体コードが4桁の場合、右端に0を付与 */
        for (var i=0; i<dataObjTheme.length; i++){

            var _row = dataObjTheme[i];

            if (_row["MuniCode"].length == 4){
                _row["MuniCode"] = "0" + _row["MuniCode"];
            }
            _row["Year"] =      parseInt(_row["Year"]);
            _row["MuniCode"] =  parseInt(_row["MuniCode"]);
            _row["mean"] =      parseFloat(_row["mean"]);
            _row["sd"] =        parseFloat(_row["sd"]);

            for (var j = 0; j <= 50; j++) {
                _row["H" + j] = parseFloat(_row["H" + j]);
                _row["L" + j] = parseFloat(_row["L" + j]);
            }

        }
        
        console.log("dataObjTheme", dataObjTheme);
        _data = null;

        yearArray = _.uniq(_.map(dataObjTheme, 'Year'))

        PubSub.publish('init:vizslider');
    });
}



var initVizSlider = function() {
    console.log("initVizSlider");

    /* Color Scale Slider */
    d3.select("#swiperColor").selectAll("div").remove();

    d3.select("#swiperColor")
    .selectAll("div")
    .data(valueNameArray)
    .enter()
    .append("div")
    .attr("class", "swiper-slide")
    .text(function(d) { return d; });

    if (swiperColor && typeof swiperColor.destroy === "function") {
        swiperColor.destroy(true, true);
    }

    swiperColor = new Swiper('#swiper-container-color', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-color',
            prevEl: '#swiper-button-prev-color',
        },
        on: {
            slideChange: function(e) {
            colorIndex = e.activeIndex;
            fl_map = "updateMap";
            PubSub.publish('change:color');
            }
        }
    });



    /* Depth Scale Slider */
    d3.select("#swiperDepth").selectAll("div").remove();

    d3.select("#swiperDepth")
    .selectAll("div")
    .data(valueNameArray)
    .enter()
    .append("div")
    .attr("class", "swiper-slide")
    .text(function(d) { return d; });

    if (swiperDepth && typeof swiperDepth.destroy === "function") {
        swiperDepth.destroy(true, true);
    }

    swiperDepth = new Swiper('#swiper-container-depth', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-depth',
            prevEl: '#swiper-button-prev-depth',
        },
        on: {
            slideChange: function(e) {
            depthIndex = e.activeIndex;
            fl_map = "updateMap";
            PubSub.publish('change:color');
            }
        }
    });



    /* Visualization Scale Var Slider */
    d3.select("#swiperScale").selectAll("div").remove();

    d3.select("#swiperScale")
    .selectAll("div")
    .data(scaleArray)
    .enter()
    .append("div")
    .attr("class", "swiper-slide")
    .text(function(d) { return d; });

    if (swiperScale && typeof swiperScale.destroy === "function") {
        swiperScale.destroy(true, true);
    }

    swiperScale = new Swiper('#swiper-container-scale', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-scale',
            prevEl: '#swiper-button-prev-scale',
        },
        on: {
            slideChange: function(e) {
            scaleIndex = e.activeIndex;
            fl_map = "updateMap";
            PubSub.publish('change:color');
            }
        }
    });



    /* 2d3d Change Slider */
    d3.select("#swiper2d3dChange").selectAll("div").remove();

    d3.select("#swiper2d3dChange")
    .selectAll("div")
    .data(d23Array)
    .enter()
    .append("div")
    .attr("class", "swiper-slide")
    .text(function(d) { return d; });

    if (swiper2d3dChange && typeof swiper2d3dChange.destroy === "function") {
        swiper2d3dChange.destroy(true, true);
    }

    swiper2d3dChange = new Swiper('#swiper-container-2d3d', {
        slidesPerView: 2,
        spaceBetween: 1,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-2d3d',
            prevEl: '#swiper-button-prev-2d3d',
        },
        on: {
            slideChange: function(e) {
            d23ArrayIndex = e.activeIndex;
            console.log("d23ArrayIndex", d23ArrayIndex);
            console.log("d23Array", d23Array[d23ArrayIndex]);
            PubSub.publish('change:dimension');
            }
        }
    });



    /* Year Slider */
    d3.select("#swiperYear").selectAll("div").remove();
  
    d3.select("#swiperYear")
      .selectAll("div")
      .data(yearArray)
      .enter()
      .append("div")
      .attr("class", "swiper-slide")
      .text(function(d) { return d; });
  
    if (swiperYear && typeof swiperYear.destroy === "function") {
        swiperYear.destroy(true, true);
    }

    swiperYear = new Swiper('#swiper-container-year', {
      slidesPerView: 2,
      spaceBetween: 1,
      centeredSlides: true,
      navigation: {
        nextEl: '#swiper-button-next-year',
        prevEl: '#swiper-button-prev-year',
      },
      on: {
        slideChange: function(e) {
          yearIndex = e.activeIndex;
          console.log("swiperYear", yearArray[yearIndex]);
          fl_map = "updateMap";
          PubSub.publish('filter:bydata');
        }
      }
    });

    PubSub.publish('navlink:setup');
};



var setupNav = function() {
    console.log("setupNav");

    // 各navリンクのクリックイベント設定
    navLinks.forEach(link => {
        if (link) {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            if (this.id === "datachange" || this.id === "vizchange") {
            if (slideOverContainer && sidepanel) {

                selectedNav = this.id;
                console.log("selectedNav", selectedNav);

                PubSub.publish('navlink:disabled');
                PubSub.publish('panel:open');
            }
            }
        });
        }
    });

    PubSub.publish('panel:setup');
}



var setupPanel = function() {
    console.log("setupPanel");

    if (closeButton && slideOverContainer && sidepanel) {
        closeButton.addEventListener("click", () => {
          PubSub.publish('panel:close');
        });
    }

    PubSub.publish('filter:bydata');
}



var disableNavLinks = function() {
    console.log("disableNavLinks");
    navLinks.forEach(link => {
        if (link) {
          link.classList.add('pointer-events-none');
          link.classList.remove("text-white", "bg-gray-900", "text-white", "hover:bg-gray-700", "hover:text-white");
          link.classList.add("text-gray-300");
        }
    });
}

var enableNavLinks = function() {
    console.log("enableNavLinks");
    navLinks.forEach(link => {
        if (link) {
          link.classList.remove('pointer-events-none');
          link.classList.remove("text-gray-300");
          link.classList.add("text-white", "bg-gray-900", "hover:bg-gray-700", "hover:text-white");
        }
    });
}

var openPanel = function() {
    console.log("openPanel");

    slideOverContainer.classList.remove("hidden");
    void sidepanel.offsetWidth; // 強制再描画
    sidepanel.classList.remove("-translate-y-full");
    sidepanel.classList.add("translate-y-0");
    console.log("Slide-over panel opened");
    // disableNavLinks();
  
    // タイトル、説明文の更新と該当パネルの表示切替
    if (contentTitle) {
      if (selectedNav === "datachange") {
        contentTitle.textContent = "データの変更";
        // contentDescription.textContent = "Update your data using the options below.";
        document.getElementById("datachange-panel").classList.remove("hidden");
        document.getElementById("vizchange-panel").classList.add("hidden");
      } else if (selectedNav === "vizchange") {
        contentTitle.textContent = "可視化の変更";
        // contentDescription.textContent = "Customize the visualization style using the options below.";
        document.getElementById("vizchange-panel").classList.remove("hidden");
        document.getElementById("datachange-panel").classList.add("hidden");
      }
    }
}

var closePanel = function() {
    console.log("closePanel");

    sidepanel.classList.remove("translate-y-0");
    sidepanel.classList.add("-translate-y-full");
    console.log("Slide-over panel closing");
    setTimeout(() => {
      slideOverContainer.classList.add("hidden");
      PubSub.publish('navlink:abled');
    }, 500);
}



var filterByYear = function() {
    console.log("filterByYear");
    
    dataObjThemeFiltered = dataObjTheme.filter(row => row.Year === yearArray[yearIndex]);
    
    PubSub.publish('join:data');
}



var joinData = function() {
    console.log("joinData");

    /* combine base map& theme data */

    for(var i=0; i<dataBaseMapDetailed.features.length; i++) {

        var _muniid = dataBaseMapDetailed.features[i]["properties"]["N03_007"];
        var _props = dataBaseMapDetailed.features[i]["properties"];

        var _fl = false;

        for (var j = 0; j < dataObjThemeFiltered.length; j++) {
            if (dataObjThemeFiltered[j]["MuniCode"] == _muniid) {
              var _row = dataObjThemeFiltered[j];
              
              _props.mean = parseFloat(_row.mean);
              _props.sd = parseFloat(_row.sd);
          
              for (var k = 0; k <= 50; k++) {
                _props["L" + k] = parseFloat(_row["L" + k]);
                _props["H" + k] = parseFloat(_row["H" + k]);
              }
              _fl = true;
            }
        }

        if (!_fl){
            _props["mean"] = null;
            _props["sd"] = null;

            for (var k = 0; k <= 50; k++) {
                _props["L" + k] = null;
                _props["H" + k] = null;
            }
        }
    }



    d3.select("#selectedDir1").text(dir1[dir1Index]);
    d3.select("#selectedDir2").text(dir2[dir2Index]);
    d3.select("#selectedDir3").text(dir3[dir3Index]);
    d3.select("#selectedForColor").text(valueNameArray[colorIndex]);
    d3.select("#selectedForDepth").text(valueNameArray[depthIndex]);
    d3.select("#selectedForScale").text(scaleArray[scaleIndex]);
    d3.select("#selectedYear").text(yearArray[yearIndex]);



    fl_map = "drawMap";
    PubSub.publish('change:color');
}




var drawMap = function() {
    console.log("drawMap");



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
                    'case',

                    // データが null だった場合
                    ['==', ['get', valueNameArray[colorIndex]], null], nullColor,

                    // データが存在する場合
                    [
                        'interpolate', ['linear'],
                        ['get', valueNameArray[colorIndex]],
                        dataScaleArray[scaleIndex].minData, minColor,
                        dataScaleArray[scaleIndex].maxData, maxColor
                    ]
                ],

                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['get', valueNameArray[depthIndex]],
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



        /* --------------------
            ポップアップ
        -------------------- */

        /* Mapbox ポップアップ */
        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false
        });


        /* Mapbox interaction */
        mapObject.on('click', 'naro_prob', function (e) {

            var _selected = e.features[0].properties.N03_007;

            // console.log( "assets/data_detail/" + dir1[dir1Index] + "/" + dir2[dir2Index] + "/" + dir3[dir3Index] + "/" + _selected + ".png");

            var lightbox = lity('popup.html');

            window.setTimeout(function(){
                // console.log("_selected", _selected);
                
                var iframeElem = document.getElementsByTagName('iframe');
                var iframeDocument = iframeElem[1].contentDocument || iframeElem[1].contentWindow.document;

                var _pElem1 = iframeDocument.getElementsByClassName('kirakirakira')[0];
                _pElem1.textContent = _selected;

            }, 3000);

        });



        mapObject.on('mousemove', 'naro_prob', (e) => {

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

                if (e.features[0].properties[valueNameArray[colorIndex]]) {
                    var _addressB = e.features[0].properties[valueNameArray[colorIndex]];
                } else {
                    var _addressB = "undefined";
                }

                var _addressA = _address_1 + _address_2 + _address_3 + _address_4;
                // var _addressB = e.features[0].properties["N03_007"];



                // 対象自治体の中心点を取得
                const coordinates = e.features[0].geometry.coordinates.slice();

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
                popup.setLngLat([_lng, _lat]).setHTML(_addressA + "<br />" + "value: " + _addressB).addTo(mapObject);

        });



        mapObject.on('mouseout', 'naro_prob', function () {

            mapObject.getCanvas().style.cursor = 'auto';
            popup.remove();

        });



        fl_firsttime = false;
        PubSub.publish('init:print');

    } else {
        mapObject.getSource('naro').setData(dataBaseMapDetailed);
    }

    PubSub.publish('update:legend');
}



var updateMap = function() {
    console.log("updateMap");


    /* 大地図 */
    mapObject.setPaintProperty(
        "naro_prob",
        'fill-extrusion-height',
            ['interpolate', ['linear'],
            ['get', valueNameArray[depthIndex]],
            dataScaleArray[scaleIndex].minData, minHeight,
            dataScaleArray[scaleIndex].maxData, maxHeight]
    );

    mapObject.setPaintProperty(
        "naro_prob",
        'fill-extrusion-color',
        ['case',
          // データが null の場合は nullColor を設定
          ['==', ['get', valueNameArray[colorIndex]], null],
          nullColor,
          // それ以外は interpolate で色を計算
          ['interpolate', ['linear'],
            ['get', valueNameArray[colorIndex]],
            dataScaleArray[scaleIndex].minData, minColor,
            dataScaleArray[scaleIndex].maxData, maxColor
          ]
        ]
    );
  
    PubSub.publish('update:legend');
}





var updateLegend = function() {
    console.log("updateLegend");

    // グラデーションの色が変わる場合は更新
    d3.select("#" + legendGradientId)
        .selectAll("stop")
        .data([
            { offset: "0%", color: minColor },
            { offset: "100%", color: maxColor }
        ])
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    // 最小値・最大値テキストを再設定 (小数点以下13桁でもそのまま)
    var svg = d3.select("#legendSvg");
    if (!svg.empty()){
        svg.select("#legendMinText")
            .text(dataScaleArray[scaleIndex].minData);

        svg.select("#legendMaxText")
            .text(dataScaleArray[scaleIndex].maxData);
    }
};



var initPrint = function() {
    console.log("initPrint");

        /* プリント・ダイアログ閉じたあとの挙動 */
        window.addEventListener('afterprint', (event) => {
            console.log('After print');

            d3.select("#mapContainer .maplibregl-control-container").style("display", "block");
        });

        /* プリントボタン設置 & プリント・ダイアログ開いたあとの挙動 */
        document.querySelector('#printBtn').addEventListener('click', () => {
            console.log('print');

            d3.select("#mapContainer .maplibregl-control-container").style("display", "none");

            window.print();
        });
}




var changeColor = function() {
    console.log("changeColor");

    if (scaleIndex == 0) { // 0 の場合は、固定値の最小値と最大値

        dataScaleArray[scaleIndex].minData = minDataFixed;
        dataScaleArray[scaleIndex].maxData = maxDataFixed;

    } else if (scaleIndex == 1) { // 1 の場合は、テーマデータ内の実際の最小値と最大値

            var _ddd = valueNameArray[colorIndex];
            // console.log("_ddd", _ddd);

            var _columnValues = dataObjThemeFiltered.map(function(d) {
                return +d[_ddd];
            });
            // latterObj = _.orderBy(_columnValues, [], ['desc']);
            // console.log("_columnValues", latterObj);

            dataScaleArray[scaleIndex].minData = d3.min(_columnValues);
            dataScaleArray[scaleIndex].maxData = d3.max(_columnValues);

            // console.log("minData",dataScaleArray[scaleIndex].minData);
            // console.log("maxData",dataScaleArray[scaleIndex].maxData);
    }

    colorScale
        .domain([dataScaleArray[scaleIndex].minData, dataScaleArray[scaleIndex].maxData])
        .range([minColor, maxColor]);

    // console.log("changeColor fl_map", fl_map)
    if (fl_map == "drawMap") {
        PubSub.publish('draw:map');
    } else if (fl_map == "updateMap") {
        PubSub.publish('update:map');
    }
}



var changeDimension = function() {
    console.log("changeDimension");

    if (d23ArrayIndex === 0) { // 3D モードに切り替え

        mapObject.easeTo({ pitch: 60, duration: 1000 });
        mapObject.dragRotate.enable();
        mapObject.touchZoomRotate.enable();

      } else if (d23ArrayIndex === 1) { // 2D モードに切り替え

        mapObject.easeTo({ pitch: 0, duration: 1000 });
        mapObject.dragRotate.disable();
        mapObject.touchZoomRotate.disable();
      }
}


PubSub.subscribe('init:basemap', initBaseMap);
PubSub.subscribe('load:filelist', loadFileList);
PubSub.subscribe('init:dataslider', initDataSlider);
PubSub.subscribe('init:mapui', initMapUI);
PubSub.subscribe('init:legend', initLegend);
PubSub.subscribe('load:basemap', loadBasemap);
PubSub.subscribe('load:themedata', loadThemeData);
PubSub.subscribe('init:vizslider', initVizSlider);

PubSub.subscribe('navlink:setup', setupNav);
PubSub.subscribe('navlink:disabled', disableNavLinks);
PubSub.subscribe('navlink:abled', enableNavLinks);
PubSub.subscribe('panel:setup', setupPanel);
PubSub.subscribe('panel:open', openPanel);
PubSub.subscribe('panel:close', closePanel);

PubSub.subscribe('filter:bydata', filterByYear);
PubSub.subscribe('join:data', joinData);
PubSub.subscribe('draw:map', drawMap);
PubSub.subscribe('update:map', updateMap);
PubSub.subscribe('update:legend', updateLegend);

PubSub.subscribe('init:print', initPrint);
PubSub.subscribe('change:color', changeColor);
PubSub.subscribe('change:dimension', changeDimension);

PubSub.publish('init:basemap');
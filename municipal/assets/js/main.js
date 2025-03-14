/* --------------------
　地図設定パラメータ
-------------------- */

/* MapObject */
var mapObject;
var minZoomLevel = 8;
var maxZoomLevel = 14;

/* Map Tile */
var maptileURL = [];
maptileURL[0] = "https://api.maptiler.com/maps/positron/style.json?key=p3yGzZkqo3eCxtEynu6W";
maptileURL[1] = "https://api.maptiler.com/maps/darkmatter/style.json?key=p3yGzZkqo3eCxtEynu6W";
var maptileIndex = 0;

var POI = [
  {
    city: "NARO",
    longitude: 140.110249,
    latitude: 36.027363,
    zoom: minZoomLevel,
    pitch: 75,
    bearing: 0,
  },
  {
    city: "Tokyo Station",
    longitude: 139.767125,
    latitude: 35.681236,
    zoom: minZoomLevel,
    pitch: 45,
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
var filepath;

/* Data Object */
var dataBaseMapSimple;      // Base Map Simple
var dataBaseMapDetailed;    // Base Map Detail
var dataObjTheme;           // Theme Data
var dataObjThemeFiltered;   // Theme Data Filtered



/* --------------------
　スケール：データ
-------------------- */

/* Color Data Scale */
// 0 の場合は、固定値の最小値と最大値
// 1 の場合は、テーマデータ内の実際の最小値と最大値

var _obj1 = {minData: 0.0, maxData: 300.0};
var minDataFixed = 0.0;
var maxDataFixed = 10.0;
var _obj2 = {minData: minDataFixed, maxData: maxDataFixed};

var colorDataScaleArray = [];
colorDataScaleArray.push(_obj1);
colorDataScaleArray.push(_obj2);



/* Depth Data Scale */
// 0 の場合は、固定値の最小値と最大値
// 1 の場合は、テーマデータ内の実際の最小値と最大値

var _depthobj1 = {minData: 0.0, maxData: 300.0};
var minDepthDataFixed = 0.0;
var maxDepthDataFixed = 10.0;
var _depthobj2 = {minData: minDepthDataFixed, maxData: maxDepthDataFixed};

var depthDataScaleArray = [];
depthDataScaleArray.push(_depthobj1);
depthDataScaleArray.push(_depthobj2);



/* --------------------
　スケール：表現
-------------------- */

/* Color */
var minColor = "#333333";
var maxColor = "#FFFFFF";
var nullColor = "#c3c7c9";

/* Height */
var minHeight = 0;
var maxHeight = 5000;



/* ------------------------------
　データの変更
------------------------------ */

// 変数名リスト
var varList = [];
var varListRemove = ['Year', 'MuniCode'];
var valueNameArray = [];

// 色と高さへ割り当てる変数管理
var colorIndex = 0;
var depthIndex = 0;

// 年度管理
var yearArray = new Array();
var yearIndex = 0;



/* ------------------------------
　ナビゲーション
------------------------------ */

// 各navボタンの取得（ID指定）
const dataLink = document.getElementById("datachange");
const vizLink = document.getElementById("vizchange");
const navLinks = [dataLink, vizLink];
const printLink = document.getElementById("printBtn");
var selectedNav = "";



/* ------------------------------
　可視化の変更
------------------------------ */

/* Swiper UI Visualization Scale */
var scaleArray = ["Relative","Absolute"]
var scaleIndex = 1;

/* Swiper UI 2d3d Change */
var dimensionArray = ["3D","2D"]
var dimensionArrayIndex = 0;

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
var legendOuterHeight = 40;  // 凡例SVG全体の高さ
var legendBarWidth = 100;    // グラデーションバーの幅
var legendBarHeight = 10;    // グラデーションバーの高さ
var legendWidthMargin = (legendOuterWidth - legendBarWidth)/2;



/* ------------------------------
　ユーティリティ関数
------------------------------ */
function formatNumber(num) {
    return num.toString().padStart(2, '0');
}
var formatTwoDecimal = d3.format(".2f");

// デバウンス関数
function debounce(func, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    }
}



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
        if (dimensionArrayIndex === 1 && mapObject.getPitch() !== 0) {
            mapObject.setPitch(0);
        }
    });
}


var loadFileList = function() {
    console.log("loadFileList");

    Promise.all([
        d3.csv("data/data_lib/filelist.csv")
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
        initialSlide: dir1Index,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
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
        initialSlide: dir2Index,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
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
        initialSlide: dir3Index,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
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

    // 既存の凡例内容をクリア
    d3.select("#legendBar").selectAll("*").remove();

    // SVG全体のサイズ（横幅380px、高さ40px）
    var legendOuterWidth = 380;
    var legendOuterHeight = 40;

    // SVG 作成
    var svg = d3.select("#legendBar")
        .append("svg")
        .attr("id", "legendSvg")
        .attr("width", legendOuterWidth)
        .attr("height", legendOuterHeight);

    // 共通：凡例グループの描画開始 Y 座標
    var groupY = 20;  

    // --------------------
    // 色の凡例グループ（左側）
    // --------------------
    var colorLegendBarWidth = 50;
    var barHeight = 10;  
    // 左半分の中心に配置
    var colorGroupX = (legendOuterWidth / 2) / 2 - colorLegendBarWidth / 2;
    
    // 定義：色のグラデーション
    var defs = svg.append("defs");
    var colorGradient = defs.append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
    colorGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", minColor);
    colorGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", maxColor);
    
    var colorGroup = svg.append("g")
        .attr("class", "colorLegend")
        .attr("transform", "translate(" + colorGroupX + "," + groupY + ")");
    
    // ラベル「色」
    colorGroup.append("text")
        .attr("x", colorLegendBarWidth / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text("色");
    
    // 色の凡例バー
    colorGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", colorLegendBarWidth)
        .attr("height", barHeight)
        .style("fill", "url(#legend-gradient)");

    // 最小値（左側）に ID を追加
    colorGroup.append("text")
        .attr("id", "legendColorMinText")
        .attr("x", -5)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .text(formatTwoDecimal(colorDataScaleArray[scaleIndex].minData));
    
    // 最大値（右側）に ID を追加
    colorGroup.append("text")
        .attr("id", "legendColorMaxText")
        .attr("x", colorLegendBarWidth + 5)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("font-size", "10px")
        .text(formatTwoDecimal(colorDataScaleArray[scaleIndex].maxData));

    // --------------------
    // 高さの凡例グループ（右側：折れ線グラフ）
    // --------------------
    var heightLegendChartWidth = 50;
    var heightLegendChartHeight = 20;  // 折れ線グラフの描画領域
    // 右半分の中心に配置
    var heightGroupX = (legendOuterWidth / 2) + ((legendOuterWidth / 2) / 2) - heightLegendChartWidth / 2;
    
    var heightGroup = svg.append("g")
        .attr("class", "heightLegend")
        .attr("transform", "translate(" + heightGroupX + "," + groupY + ")");
    
    // ラベル「高さ」
    heightGroup.append("text")
        .attr("x", heightLegendChartWidth / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text("高さ");

    // 折れ線グラフ用の線（左下→右上）
    var lineData = [
        { x: 0, y: heightLegendChartHeight-6 },  // 最小値側（左下）
        { x: heightLegendChartWidth, y: 0 }       // 最大値側（右上）
    ];
    var lineGenerator = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    heightGroup.append("path")
        .attr("d", lineGenerator(lineData))
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "none");
    
    // 端点に小さな円を追加
    heightGroup.selectAll("circle")
        .data(lineData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 2)
        .attr("fill", "#000");
    
    // 最小値テキスト（左下端、y 座標を少し上げる）
    heightGroup.append("text")
        .attr("id", "legendHeightMinText")
        .attr("x", -5)
        .attr("y", heightLegendChartHeight - 6)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .text(formatTwoDecimal(depthDataScaleArray[scaleIndex].minData));
        
    // 最大値テキスト（右上端）
    heightGroup.append("text")
        .attr("id", "legendHeightMaxText")
        .attr("x", heightLegendChartWidth + 5)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("font-size", "10px")
        .text(formatTwoDecimal(depthDataScaleArray[scaleIndex].maxData));

    PubSub.publish('init:modal');
};



var initModal = function() {
    console.log("initModal");

    const closeModalButton = document.getElementById('closeModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalDialog = document.getElementById('modalDialog');
    
    closeModalButton.addEventListener('click', function() {
        modalBackdrop.classList.add('hidden');
        modalDialog.classList.add('hidden');
    });

    PubSub.publish('load:basemap');
}



var loadBasemap = function() {
    console.log("loadBasemap");

    Promise.all([
        d3.json("data/data_lib/" + "JapanMapDetail.json"),
        d3.json("data/data_lib/" + "JapanMapSimple.json")
    ]).then(function (_data) {
        dataBaseMapDetailed = _.cloneDeep(_data[0]);
        dataBaseMapSimple = _.cloneDeep(_data[1]);

        PubSub.publish('navlink:setup');
    });
}



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

    PubSub.publish('load:themedata');
}



var loadThemeData = function() {
    console.log("loadThemeData");

    // detect swiper
    filepath = dir1[dir1Index] + "/" + dir2[dir2Index] + "/" + dir3[dir3Index] + ".csv";

    // load: theme data
    Promise.all([
        d3.csv("data/data_index/" + filepath)
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
        initialSlide: colorIndex,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-color',
            prevEl: '#swiper-button-prev-color',
        },
        on: {
            slideChange: function(e) {
            colorIndex = e.activeIndex;
            d3.select("#selectedForColor").text(valueNameArray[colorIndex]);
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
        initialSlide: depthIndex,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-depth',
            prevEl: '#swiper-button-prev-depth',
        },
        on: {
            slideChange: function(e) {
            depthIndex = e.activeIndex;
            d3.select("#selectedForDepth").text(valueNameArray[depthIndex]);
            fl_map = "updateMap";
            PubSub.publish('change:depth');
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
        initialSlide: scaleIndex,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-scale',
            prevEl: '#swiper-button-prev-scale',
        },
        on: {
            slideChange: function(e) {
            scaleIndex = e.activeIndex;
            d3.select("#selectedForScale").text(scaleArray[scaleIndex]);
            fl_map = "updateMap";
            PubSub.publish('change:color');
            PubSub.publish('change:depth');
            }
        }
    });



    /* Dimension Change Slider */
    d3.select("#swiperDimensionChange").selectAll("div").remove();

    d3.select("#swiperDimensionChange")
    .selectAll("div")
    .data(dimensionArray)
    .enter()
    .append("div")
    .attr("class", "swiper-slide")
    .text(function(d) { return d; });

    if (swiperDimensionChange && typeof swiperDimensionChange.destroy === "function") {
        swiperDimensionChange.destroy(true, true);
    }

    swiperDimensionChange = new Swiper('#swiper-container-dimension', {
        initialSlide: dimensionArrayIndex,
        slidesPerView: 2,
        spaceBetween: 1,
        runCallbacksOnInit: false,
        centeredSlides: true,
        navigation: {
            nextEl: '#swiper-button-next-dimension',
            prevEl: '#swiper-button-prev-dimension',
        },
        on: {
            slideChange: function(e) {
            dimensionArrayIndex = e.activeIndex;
            console.log("dimensionArrayIndex", dimensionArrayIndex);
            console.log("dimensionArray", dimensionArray[dimensionArrayIndex]);
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
      yearIndex: yearIndex,
      slidesPerView: 2,
      spaceBetween: 1,
      runCallbacksOnInit: false,
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

    PubSub.publish('filter:bydata');
};



var disableNavLinks = function() {
    console.log("disableNavLinks");
    navLinks.forEach(link => {
        if (link) {
          link.classList.add('pointer-events-none');
          link.classList.remove("text-white", "bg-gray-900", "text-white", "hover:bg-gray-700", "hover:text-white");
          link.classList.add("text-gray-300");
        }
    });
    printLink.classList.add('pointer-events-none');
    printLink.classList.remove("text-white", "bg-gray-900", "text-white", "hover:bg-gray-700", "hover:text-white");
    printLink.classList.add("text-gray-300");
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
    printLink.classList.remove('pointer-events-none');
    printLink.classList.remove("text-gray-300");
    printLink.classList.add("text-white", "bg-gray-900", "hover:bg-gray-700", "hover:text-white");
}

var openPanel = function() {
    console.log("openPanel");

    slideOverContainer.classList.remove("hidden");
    void sidepanel.offsetWidth; // 強制再描画
    sidepanel.classList.remove("-translate-y-full");
    sidepanel.classList.add("translate-y-0");
    console.log("Slide-over panel opened");
  


    if (contentTitle) {
      if (selectedNav === "datachange") {
        contentTitle.textContent = "データの変更";
        document.getElementById("datachange-panel").classList.remove("hidden");
        document.getElementById("vizchange-panel").classList.add("hidden");
      } else if (selectedNav === "vizchange") {
        contentTitle.textContent = "可視化の変更";
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
                valueNameArray.forEach(function(key) {
                    var val = parseFloat(_row[key]);
                    _props[key] = isNaN(val) ? _row[key] : val;
                });
                _fl = true;
                break;
            }
        }

        if (!_fl) {
            valueNameArray.forEach(function(key) {
                _props[key] = null;
            });
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
                        colorDataScaleArray[scaleIndex].minData, minColor,
                        colorDataScaleArray[scaleIndex].maxData, maxColor
                    ]
                ],

                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['get', valueNameArray[depthIndex]],
                    depthDataScaleArray[scaleIndex].minData, minHeight,
                    depthDataScaleArray[scaleIndex].maxData, maxHeight
                ],
                'fill-extrusion-vertical-gradient': true
            },
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

            var _selectedArea = "";

            var _v1 = e.features[0].properties.N03_001;
            if (_v1 !== null && _v1 !== undefined) {
                _selectedArea = _selectedArea + _v1;
            }

            var _v2 = e.features[0].properties.N03_002;
            if (_v2 !== null && _v2 !== undefined) {
                _selectedArea = _selectedArea + _v2;
            }
  
            var _v3 = e.features[0].properties.N03_003;
            if (_v3 !== null && _v3 !== undefined) {
                _selectedArea = _selectedArea + _v3;
            }

            var _v4 = e.features[0].properties.N03_004;
            if (_v4 !== null && _v4 !== undefined) {
                _selectedArea = _selectedArea + _v4;
            }

            modalBackdrop.classList.remove('hidden');
            modalDialog.classList.remove('hidden');

            window.setTimeout(function(){

                    Promise.all([
                            d3.csv("data/data_detail/" + filepath)
                    ]).then(function (_data) {

                            var _DetailTitle = _data[0][0]["Title"] + " - " + _selectedArea;
                            d3.select("#detailTitle").text(_DetailTitle);
                            d3.select("#detailImageURL").attr("src", _data[0][0]["ImageURL"]);
                            d3.select("#detailDesc").text(_data[0][0]["Description"]);
        
                    });

            }, 50);

        });



        mapObject.on('mousemove', 'naro_prob', (e) => {

                // マウスポインターの形状管理
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

                // colorIndex
                var _selectedVarColor = "";
                if (e.features[0].properties[valueNameArray[colorIndex]]) {
                    _selectedVarColor = e.features[0].properties[valueNameArray[colorIndex]];
                } else {
                    _selectedVarColor = "不明";
                }

                // colorIndex
                var _selectedVarDepth = "";
                if (e.features[0].properties[valueNameArray[depthIndex]]) {
                    _selectedVarDepth = e.features[0].properties[valueNameArray[depthIndex]];
                } else {
                    _selectedVarDepth = "不明";
                }

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
                popup
                    .setLngLat([_lng, _lat])
                    .setHTML(_addressA + "<br />"
                         + "色への値: " + _selectedVarColor + "<br />"
                         + "高さへの値: " + _selectedVarDepth)
                    .addTo(mapObject);

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

    mapObject.setPaintProperty(
        "naro_prob",
        'fill-extrusion-color',
        ['case',
          ['==', ['get', valueNameArray[colorIndex]], null],
          nullColor,
          ['interpolate', ['linear'],
            ['get', valueNameArray[colorIndex]],
            colorDataScaleArray[scaleIndex].minData, minColor,
            colorDataScaleArray[scaleIndex].maxData, maxColor
          ]
        ]
    );
  
    mapObject.setPaintProperty(
        "naro_prob",
        'fill-extrusion-height',
            ['interpolate', ['linear'],
            ['get', valueNameArray[depthIndex]],
            depthDataScaleArray[scaleIndex].minData, minHeight,
            depthDataScaleArray[scaleIndex].maxData, maxHeight]
    );
    
    PubSub.publish('update:legend');
}









var updateLegend = function() {
    console.log("updateLegend");

    var _svg = d3.select("#legendSvg");
    if (!_svg.empty()){
        d3.select("#legendColorMinText").text(formatTwoDecimal(colorDataScaleArray[scaleIndex].minData));
        d3.select("#legendColorMaxText").text(formatTwoDecimal(colorDataScaleArray[scaleIndex].maxData));
        
        d3.select("#legendHeightMinText").text(formatTwoDecimal(depthDataScaleArray[scaleIndex].minData));
        d3.select("#legendHeightMaxText").text(formatTwoDecimal(depthDataScaleArray[scaleIndex].maxData));
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

        colorDataScaleArray[scaleIndex].minData = minDataFixed;
        colorDataScaleArray[scaleIndex].maxData = maxDataFixed;

    } else if (scaleIndex == 1) { // 1 の場合は、テーマデータ内の実際の最小値と最大値

            var _ddd = valueNameArray[colorIndex];

            var _columnValues = dataObjThemeFiltered.map(function(d) {
                return +d[_ddd];
            });

            colorDataScaleArray[scaleIndex].minData = d3.min(_columnValues);
            colorDataScaleArray[scaleIndex].maxData = d3.max(_columnValues);
    }

    if (fl_map == "drawMap") {
        PubSub.publish('draw:map');
    } else if (fl_map == "updateMap") {
        PubSub.publish('update:map');
    }
}



var changeDepth = function() {
    console.log("changeDepth");

    if (scaleIndex == 0) { // 0 の場合は、固定値の最小値と最大値

        depthDataScaleArray[scaleIndex].minData = minDataFixed;
        depthDataScaleArray[scaleIndex].maxData = maxDataFixed;

    } else if (scaleIndex == 1) { // 1 の場合は、テーマデータ内の実際の最小値と最大値

            var _ddd = valueNameArray[depthIndex];

            var _columnValues = dataObjThemeFiltered.map(function(d) {
                return +d[_ddd];
            });

            depthDataScaleArray[scaleIndex].minData = d3.min(_columnValues);
            depthDataScaleArray[scaleIndex].maxData = d3.max(_columnValues);
    }

    if (fl_map == "drawMap") {
        PubSub.publish('draw:map');
    } else if (fl_map == "updateMap") {
        PubSub.publish('update:map');
    }
}



var changeDimension = function() {
    console.log("changeDimension");

    if (dimensionArrayIndex === 0) { // 3D モードに切り替え

        mapObject.easeTo({ pitch: 60, duration: 1000 });
        mapObject.dragRotate.enable();
        mapObject.touchZoomRotate.enable();

      } else if (dimensionArrayIndex === 1) { // 2D モードに切り替え

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
PubSub.subscribe('init:modal', initModal);
PubSub.subscribe('load:basemap', loadBasemap);
// PubSub.subscribe('load:themedata', loadThemeData);
PubSub.subscribe('load:themedata', debounce(loadThemeData, 200));
PubSub.subscribe('init:vizslider', initVizSlider);

PubSub.subscribe('navlink:setup', setupNav);
PubSub.subscribe('navlink:disabled', disableNavLinks);
PubSub.subscribe('navlink:abled', enableNavLinks);
PubSub.subscribe('panel:setup', setupPanel);
PubSub.subscribe('panel:open', openPanel);
PubSub.subscribe('panel:close', closePanel);

// PubSub.subscribe('filter:bydata', filterByYear);
PubSub.subscribe('filter:bydata', debounce(filterByYear, 200));

PubSub.subscribe('join:data', joinData);
PubSub.subscribe('draw:map', drawMap);
PubSub.subscribe('update:map', updateMap);
PubSub.subscribe('update:legend', updateLegend);

PubSub.subscribe('init:print', initPrint);
// PubSub.subscribe('change:color', changeColor);
PubSub.subscribe('change:color', debounce(changeColor, 200));
// PubSub.subscribe('change:depth', changeDepth);
PubSub.subscribe('change:depth', debounce(changeDepth, 200));
PubSub.subscribe('change:dimension', changeDimension);

PubSub.publish('init:basemap');
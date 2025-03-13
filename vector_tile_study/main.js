    var map = new maplibregl.Map({
      container: 'map',
      zoom: 13,
      center: [139.6917, 35.6895], // 例: 東京
      style: {
        version: 8,
        sources: {
          "vector-tiles": {
            type: "vector",
            tiles: ["http://127.0.0.1:5500/tileset/{z}/{x}/{y}.pbf"],
            minzoom: 0,
            maxzoom: 14
          }
        },
        layers: [
          {
            id: "layer-fill",
            type: "fill",
            source: "vector-tiles",
            "source-layer": "5_joint", // ※実際のレイヤ名に合わせて変更
            paint: {
              "fill-color": "#0000ff",
              "fill-opacity": 0.6,
              'fill-outline-color': '#ffffff'
            }
          }
        ]
      }
    });

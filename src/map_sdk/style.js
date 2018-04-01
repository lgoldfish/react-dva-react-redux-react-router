export default {
    "version": 8,
    "name": "mapbox parking",
    "glyphs": "https://palmap-source.oss-cn-shanghai.aliyuncs.com/fonts/{fontstack}/{range}.pbf",
    "light": {
        "anchor": "viewport",
        "color": "white",
        "intensity": 0.4
    },
    "sprite": "https://palmap-source.oss-cn-shanghai.aliyuncs.com/sprites/yellow-facility/sprite",
    "sources": {
        "Area": {
            "type": "geojson", "data": "http://api1cindy.palmap.cn/MapData/093O/093O01F05?type=area"
        },
        "Frame":
            {
                "type": "geojson", "data": "http://api1cindy.palmap.cn/MapData/093O/093O01F05?type=frame"
            },
        "Facility": {
            "type": "geojson", "data": "http://api1cindy.palmap.cn/MapData/093O/093O01F05?type=facility"
        },
        "highlight": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        },
        "highchange":{
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        }
        // "osmtiles": {
        //     "type": "raster", "tiles": ["http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}"], "tileSize": 256
        // },
        // "osmtiles2": { "type": "raster", "tiles": ["http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"], "tileSize": 256,"maxzoom":18 }
    },
    "layers": [
        // { "id": "simple-tiles2", "type": "raster", "source": "osmtiles2", "minzoom": 0, "maxzoom": 22 },
        // { "id": "simple-tiles", "type": "raster", "source": "osmtiles", "minzoom": 0, "maxzoom": 22 },
        {
            "id": "Frame",
            "type": "fill",
            "source": "Frame",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-color": "#ffffff"
            }
        },
        {
            "id": "Frame-Border",
            "type": "line",
            "source": "Frame",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "line-width": 3,
                "line-color": "#333333"
            }
        },
        {
            "id": "Area",
            "type": "fill",
            "source": "Area",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-color": "#ffffff"
            }
        },
        {
            "id": "Area-Grass",
            "type": "fill-extrusion",
            "source": "Area",
            "filter": ["==", "categoryid", 35002000],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-extrusion-color": "#CFEEBB",
                "fill-extrusion-height": 0.5
            }
        },
        {
            "id": "Area-Lane",
            "type": "fill",
            "source": "Area",
            "filter": [
                "in",
                "categoryid",
                17004000,
                37001000,
                37000000,
                23026000
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-color": "#808080"
            }
        },
        {
            "id": "Area-Tag-Line",
            "type": "fill",
            "source": "Area",
            "filter": ["in", "categoryid", 22086000, 22082000, 0],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-color": "#808080"
            }
        },
        {
            "id": "highchange",
            "type": "fill-extrusion",
            "source": "highchange",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-extrusion-height": 0.01,
                "fill-extrusion-color": "#FF1B2D"
            }
        },
        {
            "id": "highlight",
            "type": "fill-extrusion",
            "source": "highlight",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-extrusion-height": 0.03,
                "fill-extrusion-color": "#29CCAC"
            }
        },
        {
            "id": "Area-Car-Spot",
            "type": "fill",
            "source": "Area",
            "filter": ["in", "categoryid", 22001000, 22004000],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                //   "fill-color": "#DEC181"
                "fill-color": {
                    "property": "areacode",
                    "type": "categorical",
                    "stops": [
                        ["2731", "#ad4550"],
                        ["2732", "#dda85a"],
                        ["2533", "#ad4550"],
                        ["2534", "#dda85a"],
                        ["2503", "#ad4550"],
                        ["2504", "#dda85a"],
                        ["2505", "#1c6e9f"],
                        ["2520", "#ad4550"],
                        ["2521", "#dda85a"],
                        ["2522", "#1c6e9f"]
                    ]
                }
            }
        },
        {
            "id": "lines",
            "type": "line",
            "source": "Frame",
            layout: {
              visibility: "visible"
            },
            paint: {
              "line-width": 3,
              "line-color": "#333333"
          }
        },
        {
            "id": "Area-Car-Spot-Line",
            "type": "line",
            "source": "Area",
            "filter": ["in", "categoryid", 22001000, 22004000, 11001000],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "line-color": "#ececec",
                "line-width": 1
            }
        },
        {
            "id": "Area-Car-Spot-Text",
            "type": "symbol",
            "source": "Area",
            "filter": [
                "==",
                "categoryid",
                11001000
            ],
            "minzoom": 18,
            "layout": {
                "visibility": "visible",
                "text-field": "{display}",
                "text-anchor": "center",
                "text-size": 10
            },
            "paint": {
                "text-color": "#ffffff",
            }
        },
        {
            "id": "Area-District",
            "type": "line",
            "source": "Area",
            "filter": [
                "==",
                "categoryid",
                17004000
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "line-color": {
                    "property": "display",
                    "type": "categorical",
                    "stops": [
                        ["A区", "#ad4550"],
                        ["B区", "#dda85a"],
                        ["C区", "#1c6e9f"]
                    ]
                },
                "line-width": 2
                // "fill-opacity": 0
                // "fill-extrusion-height": 2
            }
        },
        {
            "id": "Area-All",
            "type": "fill-extrusion",
            "source": "Area",
            "filter": [
                "in",
                "categoryid",
                23999000,
                23051000,
                23000000,
                23001000,
                23004000,
                23006000,
                15026000,
                33042000,
                15019000,
                15039000,
                24014000,
                23036000,
                22005000,
                24097000
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-extrusion-color": {
                    "property": "categoryid",
                    "stops": [
                        [23999000, "#DFDFDF"],
                        [23051000, "#B6D0F1"],
                        [23000000, "#B6D0F1"],
                        [23001000, "#B6D0F1"],
                        [23004000, "#B6D0F1"],
                        [23006000, "#B6D0F1"],
                        [15026000, "#B6D0F1"],
                        [33042000, "#DEDEDE"],
                        [24097000, "#DEDEDE"],
                        [15019000, "#DDEDEA"],
                        [15039000, "#DDEDEA"],
                        [24014000, "#DDEDEA"],
                        [23036000, "#DDEDEA"],
                        [22005000, "#DDEDEA"]
                    ],
                    "type": "categorical"
                },
                "fill-extrusion-height": {
                    "property": "categoryid",
                    "stops": [
                        [23999000, 1.0],
                        [24091000, 1.0],
                        [23051000, 1.0],
                        [23000000, 1.0],
                        [23001000, 1.1],
                        [23004000, 1.0],
                        [23006000, 1.0],
                        [15026000, 1.0],
                        [33042000, 8.0],
                        [15019000, 1.0],
                        [15039000, 1.0],
                        [24014000, 1.0],
                        [23036000, 1.0],
                        [22005000, 1.0],
                        [24097000, 1.0]
                    ],
                    "type": "categorical"
                }
            }
        },
        {
            "id": "Area-District-Text",
            "type": "symbol",
            "source": "Area",
            "filter": [
                "==",
                "categoryid",
                17004000
            ],
            "layout": {
                "text-field": "{display}",
                "text-anchor": "center",
                "text-size": {
                    "stops": [
                        [16, 18],
                        [17, 24],
                        [18, 36],
                        [19, 36],
                        [20, 36]
                    ]
                },
                "text-padding": 5,
                "text-allow-overlap": true
            },
            "paint": {
                "text-color": "#1c6e9f",
                "text-opacity": {
                    "stops": [
                        [16, 1],
                        [17, 1],
                        [18, 1],
                        [19, 0.4],
                        [20, 0.4],
                    ]
                }
            }
        },
        {
            id: "Area-Other-Text",
            type: "symbol",
            source: "Area",
            // filter: ["!in", "categoryid", 22001000, 22004000, 17004000, 11001000, 15000000, 24097000],
            layout: {
                "text-field": "{display}",
                "text-offset": [0, 0],
                "text-anchor": "center",
                "text-size": 10,
                "text-padding": 5
            },
            paint: {
                "text-color": "#ffffff"
            }
        },
        {
            id: "Area-Other-POIs",
            type: "fill",
            source: "Area",
            filter: [
                "!in",
                "categoryid",
                11001000,
                35002000,
                17004000,
                37001000,
                37000000,
                22086000,
                22082000,
                22005000,
                24119000,
                0,
                22001000,
                22004000,
                23999000,
                15000000,
                24097000,
                24093000,
                24091000,
                23051000,
                23000000,
                23001000,
                23004000,
                15026000,
                15039000,
                33042000,
                24014000,
                23036000,
                23026000,
                23006000
            ],
            layout: {
                visibility: "visible"
            },
            paint: {
                "fill-color": "#CCCCFF",
                "fill-outline-color":"#333333"
            }
        },
        {
            id: "Mobile-Charge-Center",
            type: "symbol",
            source: "Area",
            filter: [
                "==",
                "categoryid",
                24119000
            ],
            layout: {
                "icon-image": "ic_zhongdianzhuang",
                "icon-size": 0.1,
                "text-field": "{display}",
                "text-size": 14,
                "text-anchor": "left",
                "text-offset": [1, 0]
            },
            paint: {
                "text-opacity": {
                    stops: [
                        [18, 0],
                        [18.2, 1],
                        [19, 1],
                    ]
                }
            }
        },
        {
            id: "Wash-Room",
            type: "symbol",
            source: "Area",
            filter: ["in", "categoryid", 23063000],
            layout: {
                "icon-image": "ic_xishoujian",
                "icon-size": 0.1,
                "text-field": "{display}",
                "text-size": 14,
                "text-anchor": "left",
                "text-offset": [1, 0]
            },
            paint: {
                "text-opacity": {
                    stops: [
                        [18, 0],
                        [18.2, 1],
                        [19, 1],
                    ]
                }
            }
        },
        {
            id: "Escalator-Room",
            type: "line",
            source: "Area",
            filter: ["in", "categoryid", 24093000, 24094000, 24095000, 24096000],
            layout: {
                "visibility": "visible"
            },
            paint: {
                "line-color": "#000000"
            }
        },
        {
            id: "Escalator",
            type: "symbol",
            source: "Area",
            filter: [
                "in",
                "categoryid",
                24093000,
                24094000,
                24095000,
                24096000,
                24097000
            ],
            layout: {
                "icon-image": "ic_futi",
                "icon-size": 0.1,
                "text-field": "{display}",
                "text-size": 14,
                "text-anchor": "left",
                "text-offset": [1, 0]
                // "text-anchor": "top-left"
            },
            paint: {
                "text-opacity": {
                    stops: [
                        [18, 0],
                        [18.2, 1],
                        [19, 1],
                    ]
                }
            }
        },
        {
            id: "Elevator",
            type: "symbol",
            source: "Area",
            filter: ["in", "categoryid", 24091000, 24092000],
            layout: {
                "icon-image": "ic_zhiti",
                "icon-size": {
                    stops: [[16, 0.1], [20, 0.1]]
                },
                "text-field": "{display}",
                "text-size": 14,
                "text-anchor": "left",
                "text-offset": [1, 0]
            },
            paint: {
                "text-opacity": {
                    stops: [
                        [18, 0],
                        [18.2, 1],
                        [19, 1],
                    ]
                }
            }
        },
        {
            id: "Elevator-Room",
            type: "fill",
            source: "Area",
            filter: ["in", "categoryid", 24091000, 24092000],
            layout: {
                "visibility": "visible"
            },
            paint: {
                "fill-color": "#eaeaea"
            }
        },
        {
            id: "Entrance",
            type: "symbol",
            source: "Facility",
            filter: [
                "in",
                "categoryid",
                23043000,
                23012000,
                23061000,
                22006000,
                23041000,
                22006000,
                22054000
            ],
            layout: {
                "icon-image": "ic_jinzhan",
                "icon-size": {
                    stops: [[16, 0.1], [20, 0.1]]
                },
                "text-field": "{display}",
                "text-size": 14,
                "text-anchor": "left",
                "text-offset": [1, 0]
            },
            paint: {
                "text-opacity": {
                    stops: [
                        [18, 0],
                        [18.2, 1],
                        [19, 1],
                    ]
                }
            }
        }
    ]
}
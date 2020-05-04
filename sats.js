let satsrc = new ol.source.Vector();

let satlayer = new ol.layer.Vector({
    source: satsrc,
    style: function(feature){
        return new ol.style.Style({
            text: new ol.style.Text({
                font: 'bold 15px "Open Sans", "Arial Unicode MS", "sans-serif"',
                fill: new ol.style.Fill({
                    color: 'white'
                }),
                text: map.getView().getZoom() >= 4 ? feature.get('name') : "",
                textAlign: 'end',
                offsetX: 5,
                offsetY: -10,
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 3
                })
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: feature.get('colour')
                })
            })
        });
    },
    declutter: false
});

function drawsats(sats){
    let satfeatures = [];
    satsrc.clear();
    sats.forEach(sat => {
        let point = new ol.Feature({
            geometry: new ol.geom.Point(sat.loc),
            name: sat.name,
            colour: sat.colour
        });
        satfeatures.push(point);
    });
    satsrc.addFeatures(satfeatures);
}

map.addLayer(satlayer);
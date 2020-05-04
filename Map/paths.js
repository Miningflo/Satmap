let pathsrc = new ol.source.Vector();

let pathlayer = new ol.layer.Vector({
    source: pathsrc,
    style: function(feature){
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: feature.get('colour'),
                width: 2
            })
        });
    },
    declutter: true
});

function drawpaths(predictions){
    let paths = [];
    pathsrc.clear();
    predictions.forEach(prediction => {
        let ls = new ol.Feature({
            geometry: new ol.geom.LineString(prediction),
            colour: 'rgba(174,174,174,0.49)'
        });
        paths.push(ls);
    });
    pathsrc.addFeatures(paths);
}

map.addLayer(pathlayer);
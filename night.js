let nightsrc = new ol.source.Vector();

let nightlayer = new ol.layer.Vector({
    source: nightsrc,
    style: function(feature){
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0.1)'
            })
        });
    }
});

function drawnight(){
    nightsrc.clear();
    let circle = new ol.Feature({
        /*geometry: new ol.geom.Circle(ol.proj.transform([3, 51], 'EPSG:4326', 'EPSG:3857'), 1000000 )*/
        /*geometry: new ol.geom.Polygon.fromCircle(new ol.geom.Circle(ol.proj.fromLonLat([0, 0]), 6371000))*/
        geometry: new ol.geom.Circle(ol.proj.transform([3, 80], 'EPSG:4326', 'EPSG:3857'), 6371000 * Math.PI / 2)
    });
    nightsrc.addFeature(circle);
}

map.addLayer(nightlayer);
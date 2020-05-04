let nightsrc = new ol.source.Vector();

let nightlayer = new ol.layer.Vector({
    source: nightsrc,
    style: function (feature) {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0.1)'
            }),
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: '#fffd2f'
                })
            }),
            stroke: new ol.style.Stroke({
                color: 'rgb(255,0,9, 0)',
                width: 2
            })
        });
    }
});

function makecircular(list) {
    return list.concat([list[0]]);
}

function torad(x) {
    return x / 180 * Math.PI;
}

function terminator(sun) {
    let terminator = [];
    let l = sun[0];
    let b = sun[1];
    for(let w = 0; w < 360; w++){
        let bb = Math.asin((Math.cos(torad(b)) * Math.sin(torad(w)))) * 180 / Math.PI;
        let x = - Math.cos(torad(l)) * Math.sin(torad(b)) * Math.sin(torad(w)) - Math.sin(torad(l)) * Math.cos(torad(w));
        let y = - Math.sin(torad(l)) * Math.sin(torad(b)) * Math.sin(torad(w)) + Math.cos(torad(l)) * Math.cos(torad(w));
        let ll = Math.atan2(y, x) * 180 / Math.PI;
        terminator.push([ll, bb]);
    }
    terminator.sort((a, b) => a[0] - b[0]);
    return terminator;
}

function findedge(p1, p2) {
    p1[0] += 180;
    p2[0] -= 180;
    return p1[1] - (p2[1] - p1[1]) / (p2[0] - p1[0]) * p1[0];
}

function nightpolys(sun) {

    if(sun[1] > 0){
        // our summer
        let tmn = terminator(sun);
        let edge = findedge([...tmn[0]], [...tmn.slice(-1)[0]]);
        tmn.unshift([-180, edge]);
        tmn.unshift([-180, -90]);
        tmn.unshift([180, -90]);
        tmn.unshift([180, edge]);
        return [makecircular(tmn.map(x => ol.proj.fromLonLat(x)))];
    }else if(sun[1] < 0){
        // our winter
        let tmn = terminator(sun);
        let edge = findedge([...tmn[0]], [...tmn.slice(-1)[0]]);
        tmn.unshift([-180, edge]);
        tmn.unshift([-180, 90]);
        tmn.unshift([180, 90]);
        tmn.unshift([180, edge]);
        return [makecircular(tmn.map(x => ol.proj.fromLonLat(x)))];
    }else {
        //equinox
        let leftline = sun[0] - 90;
        let rightline = sun[0] + 90;

        let lpoly = [
            [Math.max(-180, leftline), 90],
            [Math.max(-180, leftline), -90],
            [Math.max(-180, leftline - 180), -90],
            [Math.max(-180, leftline - 180), 90],
        ];

        let rpoly = [
            [Math.min(180, rightline), 90],
            [Math.min(180, rightline), -90],
            [Math.min(180, rightline + 180), -90],
            [Math.min(180, rightline + 180), 90],
        ];

        return [
            makecircular(lpoly.map(x => ol.proj.fromLonLat(x))),
            makecircular(rpoly.map(x => ol.proj.fromLonLat(x)))
        ];
    }
}

function drawnight() {
    let features = [];
    nightsrc.clear();
    // let sunloc = getsun();
    let date = new Date();
    let offset = parseInt(document.getElementById("slider").value);
    date = new Date(date.getTime() + offset*60000);
    let sunloc = Constants.getSolarPosition(date);
    features.push(new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(sunloc))
    }));

    let nights = nightpolys(sunloc);
    nights.forEach(night => {
        let poly = new ol.Feature({
            geometry: new ol.geom.Polygon([night])
        });
        features.push(poly);
    });
    nightsrc.addFeatures(features);
}

map.addLayer(nightlayer);
let nightsrc = new ol.source.Vector();

let nightlayer = new ol.layer.Vector({
    source: nightsrc,
    style: function (feature) {
        console.log("applying style");
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0.1)'
            }),
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: '#fffd2f'
                })
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


function getsun() {
    let today = new Date();
    let first = new Date(today.getFullYear(), 0, 1);
    let d = Math.round(((today - first) / 1000 / 60 / 60 / 24));
    let m = -3.6 + 0.9856 * d;
    let v = m + 1.9 * Math.sin(torad(m));
    let lambda = v + 102.9;
    let delta = -1 * (22.8 * Math.sin(torad(lambda)) + 0.6 * Math.pow(Math.sin(torad(lambda)), 3));

    let t = today.getUTCHours() + today.getUTCMinutes()/60;
    let bsun = delta;
    let lsun = 180 - 15 * t;
    return [lsun, bsun];
}

function terminator(sun) {
    let terminator = [];
    console.log(sun);
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
    let tmn = terminator(sun);
    if(sun[1] > 0){
        // our summer
        let edge = findedge([...tmn[0]], [...tmn.slice(-1)[0]]);
        tmn.unshift([-180, edge]);
        tmn.unshift([-180, -90]);
        tmn.unshift([180, -90]);
        tmn.unshift([180, edge]);
        return [makecircular(tmn.map(x => ol.proj.fromLonLat(x)))];
    }else if(sun[1] < 0){
        // our winter
        let edge = findedge([...tmn[0]], [...tmn.slice(-1)[0]]);
        tmn.unshift([-180, edge]);
        tmn.unshift([-180, 90]);
        tmn.unshift([180, 90]);
        tmn.unshift([180, edge]);
        return [makecircular(tmn.map(x => ol.proj.fromLonLat(x)))];
    }else {
        //equinox
        let left = tmn.splice(0, tmn.length/2);
        let right = tmn;

        left.unshift([-90, 90]);
        left.unshift([-180, 90]);
        left.unshift([-180, -90]);
        left.unshift([-90, -90]);

        right.unshift([90, 90]);
        right.unshift([180, 90]);
        right.unshift([180, -90]);
        right.unshift([90, -90]);

        return [
            makecircular(left.map(x => ol.proj.fromLonLat(x))),
            makecircular(right.map(x => ol.proj.fromLonLat(x)))
        ];
    }
}

function drawnight() {
    let features = [];
    nightsrc.clear();
    let sunloc = getsun();
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
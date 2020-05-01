let nightsrc = new ol.source.Vector();

let nightlayer = new ol.layer.Vector({
    source: nightsrc,
    style: function (feature) {
        console.log("applying style");
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0.1)'
            })
        });
    }
});

function makecircular(list) {
    return list.concat(list.slice(0));
}

function totdays(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function coords(solar) {
    let today = new Date();
    let first = new Date(today.getFullYear(), 0, 1);
    let day = Math.round(((today - first) / 1000 / 60 / 60 / 24) + .5);
    console.log(day);
    console.log(totdays(today.getFullYear()));
    // let soldec = Math.cos(360/totdays(today.getFullYear()) * (day + 10)) * -23.43665;
    let m = -3.6 + 0.9856 * day;
    let v = m + 1.9 * Math.sin(m);
    let lambda = v + 102.9;
    let delta = 22.8 * Math.sin(lambda) + 0.6 * Math.pow(Math.sin(lambda), 3);
    console.log(delta);


    let l = [];
    for (let i = 0; i <= 360; i++) {
        l.push(ol.proj.fromLonLat([i - 180, 0]));
    }
    l.push(ol.proj.fromLonLat([180, 90]));
    l.push(ol.proj.fromLonLat([-180, 90]));
    return [makecircular(l)];
}

function nightpolys() {
    // calculate sun pos
    let sun = [0, 0];
    return coords(sun);

}

function drawnight() {
    let features = [];
    let nights = nightpolys();
    nightsrc.clear();
    // let line = coords([0,0]);
    nights.forEach(night => {
        let poly = new ol.Feature({
            geometry: new ol.geom.Polygon([night])
        });
        features.push(poly);
    });
    nightsrc.addFeatures(features);
}

map.addLayer(nightlayer);
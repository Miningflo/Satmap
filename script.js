loadfile("https://www.celestrak.com/NORAD/elements/starlink.txt").then(fulltle => {
    let tle = loadtle(fulltle);
    console.log(tle);
    function draw() {
        requestAnimationFrame(draw);
        drawnight();
        drawsats(tle.map(sat => {
            let t = parseFloat(document.getElementById("slider").value);
            let date = new Date();
            // t is offset in minutes of current time
            date = new Date(date.getTime() + t * 60000);
            let loc = Constants.getLonLat(sat.sgp4(date).pos);
            return new Sat(sat.satname, ol.proj.fromLonLat(loc), '#4362ff');
        }));
        drawpaths(tle.map(sat => {
            let res = [];
            for (let i = 0; i < 360; i++) {
                let t = i / 360 * 1440 / sat.no;
                t += parseFloat(document.getElementById("slider").value);
                // t is offset in minutes of current time
                let date = new Date();
                date = new Date(date.getTime() + t * 60000);
                res.push(Constants.getLonLat(sat.sgp4(date).pos));
            }
            return res.map(x => ol.proj.fromLonLat(x));
        }));
    }

    draw();
});
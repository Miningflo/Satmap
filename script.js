loadfile("./TestTLE/tle.txt").then(fulltle => {
    let tle = loadtle(fulltle);

    function draw() {
        requestAnimationFrame(draw);
        drawnight();
        drawsats(tle.map(sat => {
            let t = parseFloat(document.getElementById("slider").value);
            let date = new Date();
            // t is offset in minutes of current time
            date = new Date(date.getTime() + t * 60000);
            let loc = sat.sgp4(t);
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
                res.push(sat.sgp4(t));
            }
            return res.map(x => ol.proj.fromLonLat(x));
        }));
    }

    draw();
});
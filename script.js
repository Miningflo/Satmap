fetch("./TestTLE/tle.txt").then(res => res.text()).then(fulltle => {
    let tle = loadtle(fulltle);
    console.log(tle);
    function draw() {
        requestAnimationFrame(draw);
        drawnight();
        drawsats(tle.map(sat => {
            // t is offset in minutes of current time
            let t = parseFloat(document.getElementById("slider").value);
            let date = new Date();
            date = new Date(date.getTime() + t * 60000);
            let position = sat.sgp4(date).pos;
            let loc = Constants.getLonLat(position);
            let colour = Constants.isLit(position, date) ? '#4362ff' : '#171b54';
            return new Sat(sat.satname, ol.proj.fromLonLat(loc), colour);
        }));
        drawpaths(tle.map(sat => {
            let res = [];
            for (let i = 0; i < 360; i++) {
                // t is offset in minutes of current time
                let t = i / 360 * 1440 / sat.no;
                t += parseFloat(document.getElementById("slider").value);
                let date = new Date();
                date = new Date(date.getTime() + t * 60000);
                res.push(Constants.getLonLat(sat.sgp4(date).pos));
            }
            return res.map(x => ol.proj.fromLonLat(x));
        }));
    }

    draw();
});
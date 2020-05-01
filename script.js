fetch("./tle.txt").then(res => res.text()).then(res => {
    let tle = new Tle(res);
    function draw(){
        drawnight();
        drawsats(tle.getSats());
        drawpaths(tle.predictAll());
    }
    draw();
    // setInterval(draw, 3000);
});
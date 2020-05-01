fetch("./tle.txt").then(res => res.text()).then(res => {
    let tle = new Tle(res);
    drawnight();
    drawsats(tle.getSats());
    drawpaths(tle.predictAll());
});
function rn(min, max) {
    return Math.random() * (max - min) + min;
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    convert() {
        return ol.proj.fromLonLat([this.x, this.y]);
    }
}

class Sat {
    constructor(name, loc) {
        this.name = name;
        this.loc = loc;
        this.colour = '#4362ff'
    }
}

class Tle {
    constructor(fulltle) {
        fulltle = fulltle.split("\n");
        this.tles = [];
        while (fulltle.length) {
            this.tles.push(new SingleTle(fulltle.splice(0, 3).join("\n")));
        }
    }

    getSats() {
        let res = [];
        this.tles.forEach(tle => {
            res.push(tle.getSat());
        });
        return res;
    }

    predictAll() {
        let res = [];
        this.tles.forEach(tle => {
            res.push(tle.predict());
        });
        return res.flat();
    }
}

class SingleTle {
    constructor(tle) {
        let lines = tle.split("\n");
        this.satname = lines[0].trim();
        this.satnum = lines[1].slice(2, 7);
        this.classification = lines[1].charAt(7);
        this.year = lines[1].slice(18, 20);
        this.day = lines[1].slice(20, 32);
        this.ballistic = lines[1].slice(33, 43);
        this.d2ballistic = lines[1].slice(44, 52);
        this.drag = lines[1].slice(53, 61);
        this.elem = lines[1].slice(64, 68);

        this.incl = lines[2].slice(8, 16);
        this.raan = lines[2].slice(17, 25);
        this.eccent = lines[2].slice(26, 33);
        this.perigee = lines[2].slice(34, 42);
        this.anomaly = lines[2].slice(43, 51);
        this.motion = lines[2].slice(52, 63);
        this.revs = lines[2].slice(63, 68);

        this.location = new Location(rn(-160, 160), rn(-80, 80));
    }

    getSat() {
        // return sat on current location
        // this.location = new Location(rn(-160, 160), rn(-80, 80));
        return new Sat(this.satname, this.location.convert());
    }

    predict() {
        let start = {x: this.location.x, y: this.location.y};
        console.log(this.satname + ": calculate position in " + 0.4 * 1440 / this.motion + " minutes");
        let end = {x: 0, y: 0};
        let gen = new arc.GreatCircle(start, end);
        let line = gen.Arc(300, {offset: 30});
        let result = [];
        line.geometries.forEach(geo => {
            result.push(geo.coords.map(x => new Location(x[0], x[1]).convert()));
        });
        return result;
    }
}
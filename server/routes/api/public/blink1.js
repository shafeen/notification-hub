/**
 * blink1-server
 *
 * Original author: Tod E. Kurt, http://todbot.com/blog
 * Modified by: Shafeen Mahmud (to function as an express Router middleware)
 *
 */

"use strict";

let Blink1 = require('node-blink1');
let parsecolor = require('parse-color');
let express = require('express');
let router = express.Router();

let devices = Blink1.devices(); // returns array of serial numbers
let blink1 = null;
if( devices.length ) {
    blink1 = new Blink1();
}

let lastColor = '#000000';
let lastTime = 0;
let lastLedn = 0;
let lastRepeats = 0;

// rescan if we know we have no blink1
let blink1TryConnect = function() {
    if( blink1 ) { return false; }
    devices = Blink1.devices();
    if( devices.length ) {
        blink1 = new Blink1();
    }
    return true;
};

// Call blink1.fadeToRGB while dealing with disconnect / reconnect of blink1
let blink1Fade = function( millis, r, g, b, ledn ){
    blink1TryConnect();
    if( !blink1 ) { return "no blink1"; }
    try {
        blink1.fadeToRGB( millis, r, g, b, ledn );
    } catch(err) {
        blink1 = null;
        return ""+err;
    }
    return "success";
};

let blink1Blink = function( onoff, repeats, millis, r, g, b, ledn ) {
    // console.log("blink1Blink:", onoff, repeats, millis, r, g, b, ledn );
    if( onoff ) {
        blink1Fade( millis/2, r, g, b, ledn );
    } else {
        blink1Fade( millis/2, 0, 0, 0, ledn );
        repeats--;
    }
    onoff = !onoff;
    if( repeats ) {
        setTimeout( function() {
            blink1Blink(onoff, repeats, millis, r, g, b, ledn);
        }, millis );
    }
};

let blink1Pattern = function(time, rgb, position) {
    blink1.writePatternLine(time * 1000, rgb[0], rgb[1], rgb[2], position);
};

router.get('/', function(req, res) {
    blink1TryConnect();
    let response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "info",
        status: "success"
    };
    res.json( response );
});

router.get('/fadeToRGB', function(req, res) {
    let color = parsecolor(req.query.rgb);
    let time = Number(req.query.time) || 0.1;
    let ledn = Number(req.query.ledn) || 0;
    let status = "success";
    let rgb = color.rgb;

    if( rgb ) {
        lastColor = color.hex;
        lastTime = time;
        lastLedn = ledn;
        status = blink1Fade( time*1000, rgb[0], rgb[1], rgb[2], ledn );
    }
    else {
        status = "bad hex color specified " + req.query.rgb;
    }
    let response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "fadeToRGB",
        status: status
    };
    res.json( response );
});

router.get('/off', function(req, res) {
    lastColor = "#000000";
    blink1Fade( 100, 0,0,0, 0);
    let response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "off",
        status: "success"
    };
    res.json( response );
});

router.get('/on', function(req, res) {
    lastColor = "#FFFFFF";
    blink1Fade( 100, 255,255,255, 0);
    let response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "on",
        status: "success"
    };
    res.json( response );
});

router.get('/blink', function(req, res) {
    let color = parsecolor(req.query.rgb);
    let time = Number(req.query.time) || 0.1;
    let ledn = Number(req.query.ledn) || 0;
    let repeats = Number(req.query.repeats) || Number(req.query.count) || 3;
    let status = "success";
    let rgb = color.rgb;
    if( rgb ) {
        lastColor = color.hex;
        lastTime = time;
        lastLedn = ledn;
        lastRepeats = repeats;
        blink1Blink( true, repeats, time*1000, rgb[0], rgb[1], rgb[2], ledn );
    }
    else {
        status = "bad hex color specified " + req.query.rgb;
    }
    let response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "blink1",
        status: status
    };
    res.json( response );
});

router.get('/pattern', function(req, res) {
    let colors = req.query.rgb.split(',');
    let time = Number(req.query.time) || 0.1;
    // let repeats = Number(req.query.repeats) || Number(req.query.count) || 3;
    let repeats = parseInt( req.query.repeats || req.query.count );
    repeats = (repeats == NaN ) ? 3 : repeats;
    let status = "success";

    blink1TryConnect();
    if( blink1 ) {
        for (let i=0, len=colors.length; i < len; i++) {
            let rgb = parsecolor(colors[i]).rgb;
            blink1Pattern(time, rgb, i);
        }

        blink1.playLoop(0, colors.length, repeats);

        if (colors.length > 16) {
            status =  "can only display first 16 colors. " + colors.length + " colors specified"
        }
    }
    else {
        status = "no blink1 connected";
    }

    let response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        time: time,
        colors: colors,
        repeats: repeats,
        cmd: "pattern",
        status: status
    };

    res.json( response );
});

// respond with "Hello World!" on the homepage
router.get('/help', function(req, res) {
    res.send("<html>" +
        "<h2> Welcome to blink1-server</h2> \n" +
        "<p>" +
        "Supported URIs: <ul>\n" +
        "<li>   <code> /blink1 </code> " +
        " -- status info\n" +
        "<li>   <code> /blink1/fadeToRGB?rgb=%23FF00FF&time=1.5&ledn=2 </code> " +
        "-- fade to a RGB color over time for led\n" +
       "<li>   <code> /blink1/pattern?rgb=%23ff0000,%23ffffff,%230000ff&time=.2&repeats=8 </code> " +
        "-- blink a sequence of colors\n" +
        "</ul></p>\n" +
        "When starting server, argument specified is port to run on, e.g.:" +
        "<code> blink1-server 8080 </code>\n" +
        "</html>");
});

module.exports = router;

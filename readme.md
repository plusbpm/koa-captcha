#Koa-Captcha

Simple captcha for koa, fork from node-captcha

#Use

    var captcha = require('koa-captcha'),
        Koa = require('koa'),
        session = require('koa-generic-session'),
        app = new Koa
    
    app.use(session()) // require session
    app.use(captcha({
        url: '/captcha', // interface url
        length: 5, //code length
        fontSize: 6, //code size
        width: 250, // captcha width
        height: 150, // captcha height
        color: 'rgb(0,0,0)', // code color,
        background: 'rgb(255,255,255)', // captcha background color
        lineWidth: 1 // Interference lines width
    }))
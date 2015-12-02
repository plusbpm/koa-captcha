var Canvas = require('canvas')

module.exports = function(params) {
    if (typeof params == 'string') {
        params = {
            url: params
        }
    }
    params.color = params.color || 'rgb(0,0,0)'
    params.background = params.background || 'rgb(255,255,255)'
    params.lineWidth = params.lineWidth || 1
    params.fontSize = params.fontSize || 6
    params.codeLength = params.length || 5
    params.canvasWidth = params.width || 250
    params.canvasHeight = params.height || 150

    return function*(next) {
        if (this.request.path !== params.url) return yield next

        var canvas = new Canvas(params.canvasWidth, params.canvasHeight)
        var ctx = canvas.getContext('2d')
        ctx.antialias = 'gray'
        ctx.fillStyle = params.background
        ctx.fillRect(0, 0, params.canvasWidth, params.canvasHeight)
        ctx.strokeRect(0, 0, params.canvasWidth, params.canvasHeight)
        ctx.fillStyle = params.color
        ctx.lineWidth = params.lineWidth
        ctx.strokeStyle = params.color
        ctx.font = params.fontSize + 'px sans'

        for (var i = 0; i < 5; i++) {
            ctx.moveTo(10, Math.random() * params.canvasHeight)
            ctx.bezierCurveTo(80, Math.random() * params.canvasHeight, 160, Math.random() * params.canvasHeight, params.canvasWidth - 20, Math.random() * params.canvasHeight)
            ctx.stroke()
        }

        var text = params.text || Math.random().toString(32).substr(2, params.codeLength)

        for (i = 0; i < text.length; i++) {
            ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, (params.canvasWidth / params.codeLength) * i + params.fontSize, params.canvasHeight - (params.canvasHeight - params.fontSize * 12) / 2)
            ctx.fillText(text.charAt(i), 0, 0)
        }

        this.type = 'jpg'
        this.set({
            'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
            'Expires': 'Sun, 12 Jan 1986 12:00:00 GMT'
        })
        this.session && (this.session.captcha = text)
        this.body = yield new Promise(function(resolve, reject) {
            canvas.toBuffer(function(err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
        yield next
    }
}
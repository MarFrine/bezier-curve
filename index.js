function resetPoints(){
    points = []
    ctx.clearRect(0,0,canvas.width,canvas.height)
    initialDraw = false
}

function startBezier(){
    initialDraw = true
    updateOptions()
    calcBezier()
    drawCompleteBezier()
}

function drawCompleteBezier(){
    if(bezierPoints.length < 2) return

    if(options.drawPartly){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.strokeStyle = "rgba(255,255,255," + options.lineOpacity + ")"

        if(options.drawLines){
            ctx.beginPath()
            ctx.moveTo(points[0].x,points[0].y)
            points.forEach((thisPoint)=>{
                ctx.lineTo(thisPoint.x,thisPoint.y)
            })
            ctx.stroke()

            currentHelpingLines.forEach((thisLine)=>{
                ctx.beginPath()
                ctx.moveTo(thisLine.x1, thisLine.y1)
                ctx.lineTo(thisLine.x2, thisLine.y2)
                ctx.stroke()
            })
        }
    }

    ctx.strokeStyle = "red"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(bezierPoints[0].x, bezierPoints[0].y)
    for(let i = 1; i < bezierPoints.length; i++){
        ctx.lineTo(bezierPoints[i].x, bezierPoints[i].y)
    }
    ctx.stroke()

    if(options.drawControl) points.forEach((thisPoint)=>{thisPoint.draw()})
    points[0].draw()
    points[points.length-1].draw()

    if(options.showTangents){
        ctx.strokeStyle = "rgb(81, 127, 255)"
        ctx.lineWidth = 3
    
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        ctx.lineTo(points[1].x, points[1].y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(points[points.length-1].x, points[points.length-1].y)
        ctx.lineTo(points[points.length-2].x, points[points.length-2].y)
        ctx.stroke()
    }
}

function animateBezier(){
    console.log(options.interval)
    if(!animate && options.progress >= 1){
        options.progress = 0
        progressSlider.value = 0
    }
    animate = true
    options.progress += options.interval
    progressSlider.value = options.progress*1000
    startBezier()
    if(options.progress >= 1){
        animate = false
    } else {
        animation = setTimeout(animateBezier, 1700*options.interval)
    }
}
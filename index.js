function resetPoints(){
    points = []
    ctx.clearRect(0,0,canvas.width,canvas.height)
    initialDraw = false
}

function startBezier(){
    initialDraw = true
    options.reset()
    const formData = new FormData(form);
    if(formData.get("drawLines")) options.drawLines = true
    if(formData.get("showTangents")) options.showTangents = true
    if(formData.get("resetCanvas")) {
        options.resetCanvas = true
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
    if(formData.get("drawPartly")) options.drawPartly = true
    options.progress = progressSlider.value/100
    options.interval = 1/intervalSlider.value
    options.lineOpacity = drawLinesSlider.value/100
    calcBezier()
    drawCompleteBezier()
}

function drawCompleteBezier(){
    if(bezierPoints.length < 2) return

    if(options.drawPartly){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.strokeStyle = "rgba(255,255,255," + options.lineOpacity + ")"

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

    ctx.strokeStyle = "red"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(bezierPoints[0].x, bezierPoints[0].y)
    for(let i = 1; i < bezierPoints.length; i++){
        ctx.lineTo(bezierPoints[i].x, bezierPoints[i].y)
    }
    ctx.stroke()

    points.forEach((thisPoint)=>{thisPoint.draw()})

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
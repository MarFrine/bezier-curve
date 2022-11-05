function calcBezier() {

    bezierPoints = []
    bezierPoints.push({ x: points[0].x, y: points[0].y })

    let steps = points.length - 2
    let maxValue = 1.00001
    if(options.drawPartly){
        maxValue = options.progress + 0.00001
    }
    console.log(maxValue)
    currentHelpingLines = []
    for (let i = 0; i <= maxValue; i += options.interval) { // zeichnet die kurve schritt für schritt (erst bei 10%, dann 20%, von options.interval abhängig)
        let lastProgress = false
        if(i + options.interval > maxValue) lastProgress = true
        for (let j = 0; j < steps; j++) { // berechnet die linien so, dass erst alle linien die die "grundlinien" vebinden geziechnet werden, dann die Linien die diese verbinden, ... bis nur noch eine Linie da ist, bei der wird der finale punkt gespiechert
            newPoints["step-" + j] = []
            for (let k = 0; k < steps - j; k++) { // berechnet erst die Linie zwischen punkten 1,2,3 dann die linie zwischen punkten 2,3,4 , ... bis zum letzen Punkt
                if (j == 0) {
                    let lastStep = false // ob der punkt auf der Linie zur bezier-curve gehört (sonst wird weitere linie dort angesetzt)
                    if (steps - j - 1 == 0)
                        lastStep = true
                    newPoints["step-" + j].push({ ["point-" + k]: calcLine(points[k], points[k + 1], points[k + 2], i, lastStep, lastProgress)})
                } else {
                    let lastStep = false
                    if (k == 0 && steps - j - 1 == 0) lastStep = true
                    newPoints["step-" + j].push({ ["point-" + k]: calcLine({ x: newPoints["step-" + (j - 1)][k]["point-" + k].x1, y: newPoints["step-" + (j - 1)][k]["point-" + k].y1 }, { x: newPoints["step-" + (j - 1)][k]["point-" + k].x2, y: newPoints["step-" + (j - 1)][k]["point-" + k].y2 }, { x: newPoints["step-" + (j - 1)][k + 1]["point-" + (k + 1)].x2, y: newPoints["step-" + (j - 1)][k + 1]["point-" + (k + 1)].y2 }, i, lastStep, lastProgress) })
                }
            }
        }
    }
    if(!options.drawPartly) bezierPoints.push({ x: points[points.length - 1].x, y: points[points.length - 1].y })
}

function calcLine(point1, point2, point3, progress, lastStep, lastProgress){
    let thisX1 = point1.x + (point2.x-point1.x)*progress
    let thisY1 = point1.y + (point2.y-point1.y)*progress
    let thisX2 = point2.x + (point3.x-point2.x)*progress
    let thisY2 = point2.y + (point3.y-point2.y)*progress

    let thisX = thisX1 + (thisX2-thisX1)*progress
    let thisY = thisY1 + (thisY2-thisY1)*progress

    if(lastStep == true){
        bezierPoints.push({x:thisX, y:thisY})
    }

    if(options.drawLines && !options.drawPartly){
        ctx.fillStyle = "rgba(255,255,255,0.2)"
        ctx.strokeStyle = "rgba(255,255,255," + options.lineOpacity + ")"
        ctx.beginPath()
        ctx.arc(thisX1, thisY1, 2, 0, 2 * Math.PI)
        ctx.arc(thisX2, thisY2, 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(thisX1, thisY1)
        ctx.lineTo(thisX2, thisY2)
        ctx.stroke()
    } else if(options.drawPartly){
        if(lastProgress == true){
            currentHelpingLines.push({x1: thisX1, y1: thisY1, x2: thisX2, y2: thisY2})
        }
    }

    return {x1: thisX1, y1: thisY1, x2: thisX2, y2: thisY2}
}
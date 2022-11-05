function mouseDown(event){
    points.forEach((thisPoint)=>{
        if(Math.abs(thisPoint.x - event.x) < 10  && Math.abs(thisPoint.y - event.y) < 10 && !mouse.dragging){
            mouse.dragging = true
            mouse.drag = thisPoint.index
            thisPoint.animation = setInterval(movePointToMouse, 30)
        }
    })

    if(!mouse.dragging){
        let length = points.push(new Point(event.x, event.y, "rgb(152, 26, 190)"))
        if(length > 2){
            points[length-2].color = "white"
            points[length-2].draw()
        }
        points[length-1].index = length-1
        if(initialDraw == true){startBezier()}
    }
}

function mouseUp(event){
    if(!mouse.dragging) return

    mouse.dragging = false
    clearInterval(points[mouse.drag].animation)

    points[mouse.drag].x = mouse.x
    points[mouse.drag].y = mouse.y

    ctx.clearRect(0,0,canvas.width,canvas.height)
    points.forEach((thisPoint)=>{thisPoint.draw()})

    mouse.drag = undefined
    if(initialDraw == true){startBezier()}
}


function movePointToMouse(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    points.forEach((thisPoint)=>{
        if(thisPoint.index == mouse.drag) return
        thisPoint.draw()
    })
    points[mouse.drag].x = mouse.x
    points[mouse.drag].y = mouse.y
    if(initialDraw == true){startBezier()}

    ctx.fillStyle = "green"
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 6, 0, 2 * Math.PI)
    ctx.fill()
}
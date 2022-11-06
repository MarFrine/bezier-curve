const canvas = document.getElementById("canvas1")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener("resize", ()=>{
    console.log("test123")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    points.forEach((thisPoint)=>{thisPoint.draw()})
    if(initialDraw == true){startBezier()}
})

const ctx = canvas.getContext("2d")
const form = document.getElementById("form1")
form.reset()
form.addEventListener("change", ()=>{
    updateOptions()
})

const drawLinesSlider = document.getElementById("drawLinesSlider")
const intervalSlider = document.getElementById("intervalSlider")
const optionsDiv = document.getElementById("options")
const progressSlider = document.getElementById("progressSlider")

let options = {
    interval: 0.01,
    drawLines: false,
    lineOpacity: 0.5,
    showTangents: false,
    drawControl: false,
    drawCurve: true,
    drawPartly: false,
    progress: 0,

    reset(){
        this.interval = 0.01
        this.drawLines = false
        this.lineOpacity = 0.5
        this.showTangents = false
        this.drawCurve = true
        this.drawPartly = false
        this.progress = 0
        this.drawControl = false
    }
}

let points = []
let newPoints = {}
let bezierPoints = []
let currentHelpingLines = []
let initialDraw = false
let animate = false
let animation = undefined

mouse = {
    x: 0,
    y: 0,
    dragging: false,
    drag: undefined
}

canvas.addEventListener("mousemove", (event)=>{
    mouse.x = event.x
    mouse.y = event.y
})

class Point{
    constructor(x,y, color){
        this.x = x
        this.y = y
        this.index = undefined
        this.color = color || "white"
        this.deletable = false
        this.draw()
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI)
        ctx.fill()
    }
    countDown(){
        setTimeout(()=>{this.deletable = false}, 200)
    }
    delete(){
        points.splice(this.index, 1)
        points.forEach((thisPoint)=>{
        if(thisPoint.index > this.index){
            thisPoint.index -= 1
            if(thisPoint.index == 0){
                thisPoint.color = "rgb(152, 26, 190)"
            }
        }
        if(thisPoint.index == points.length-1){
            thisPoint.color = "rgb(152, 26, 190)"
        }
        })
        
        
        ctx.clearRect(0,0,canvas.width,canvas.height)
        points.forEach((thisPoint)=>{thisPoint.draw()})

        if(initialDraw == true){startBezier()}
    }
}

canvas.addEventListener("mousedown", (event)=>{mouseDown(event)})
canvas.addEventListener("mouseup", (event)=>{mouseUp(event)})

optionsDiv.addEventListener("click", (event)=>{
    console.log("test")
    const formData = new FormData(form);
    console.log(formData.get("drawPartly"))
    if(formData.get("drawPartly")) {
        options.drawPartly = true
        document.getElementById("progressOptions").style.display = "block"
    } else {
        options.drawPartly = false
        document.getElementById("progressOptions").style.display = "none"
    }
})

progressSlider.oninput = (event)=>{
    options.progress = progressSlider.value/1000
    console.log(options.progress)
    if(initialDraw == true){startBezier()}
    clearTimeout(animation)
    animate = false
}

function updateOptions(){
    options.reset()
    const formData = new FormData(form);
    if(formData.get("drawLines")) options.drawLines = true
    if(formData.get("showTangents")) options.showTangents = true
    if(!formData.get("drawCurve")) options.drawCurve = false
    if(formData.get("showControl")) options.drawControl = true
    if(formData.get("drawPartly")) options.drawPartly = true
    options.progress = progressSlider.value/1000
    options.interval = 1/intervalSlider.value
    options.lineOpacity = drawLinesSlider.value/100
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if(initialDraw){
        calcBezier()
        drawCompleteBezier()
    } else {
        points.forEach((thisPoint)=>{thisPoint.draw()})
    }
    
}
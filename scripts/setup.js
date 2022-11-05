const canvas = document.getElementById("canvas1")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")
const form = document.getElementById("form1")
const drawLinesSlider = document.getElementById("drawLinesSlider")
const intervalSlider = document.getElementById("intervalSlider")
const optionsDiv = document.getElementById("options")
const progressSlider = document.getElementById("progressSlider")

let options = {
    interval: 0.01,
    drawLines: false,
    lineOpacity: 0.5,
    showTangents: false,
    resetCanvas: true,
    drawPartly: false,
    progress: 0,

    reset(){
        this.interval = 0.01
        this.drawLines = false
        this.lineOpacity = 0.5
        this.showTangents = false
        this.resetCanvas = true
        this.drawPartly = false
        this.progress = 0
    }
}

let points = []
let newPoints = {}
let bezierPoints = []
let currentHelpingLines = []
let initialDraw = false

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
        this.draw()
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI)
        ctx.fill()
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
    options.progress = progressSlider.value/100
    console.log(options.progress)
    if(initialDraw == true){startBezier()}
}
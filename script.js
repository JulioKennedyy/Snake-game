const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")


const size = 30


let snake = [
    { x:270, y: 240}
]

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10
    
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPositions = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`

}

const food = {
    x: randomPositions(),
    y: randomPositions(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {

    const {x,y,color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(food.x,food.y,size,size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    
    snake.forEach((position,index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x,position.y, size,size)
    })
}

 const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right")
        snake.push({x: head.x + size, y: head.y})

    if (direction == "left")
        snake.push({x: head.x - size, y: head.y})

    if (direction == "down")
        snake.push({x: head.x, y: head.y + size})

    if (direction == "up")
        snake.push({x: head.x, y: head.y - size})

    snake.shift()
}

const chakEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y){
        snake.push(head)
        

        incrementScore()
        let x = randomPositions()
        let y = randomPositions()

        while (snake.find((position)=> position.x == x && position.y == y)){
            x = randomPositions()
            y = randomPositions()
        }
        food.x = x
        food.y = y  
        food.color = randomColor()

 
    }
}

const chakCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size

    const neckIndex = snake.length - 2
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
    const selfCollision = snake.find ((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })
    
    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const points100 = () => {
    if (snake.length >= 11 && snake.length <= 16) {
        ctx.fillStyle = randomColor()
    }
    if (snake.length >= 35 && snake.length <= 50) {
        ctx.fillStyle = "green"

    
        snake.forEach((position,index) => {

            if (index == snake.length - 1) {
                ctx.fillStyle = "#013f0e"
            }

            ctx.fillRect(position.x,position.y, size,size)
        })
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}
    
const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0,0,600,600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chakEat()
    chakCollision()
    points100()
    
    let gameSpeed = 300

    if (snake.length >= 6) {
        gameSpeed = 200
    }   else if (snake.length >= 16) {
            gameSpeed = 120
    }


    loopId = setTimeout(()=>{
        gameLoop()
    },gameSpeed)



}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
    
}


gameLoop()

document.addEventListener("keydown",({key})=>{
    
    if (key == "ArrowRight" && direction != "left"){
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }
    if (key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
    if (key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake = [{ x: 270, y: 240}]
})
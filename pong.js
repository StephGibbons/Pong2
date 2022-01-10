const { body } = document
//canvas code
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const width = 500
const height = 700
const screenWidth = window.screen.width
const canvasPosition = screenWidth / 2 - width / 2
const isMobile = window.matchMedia('(max-width: 600px)')

const paddleHeight = 10
const paddleWidth = 50


let paddleBottomX = 225
let paddleTopx = 225

let ballX = 250
let ballY = 350
const ballRadius = 5

let playerScore = 0
let botScore = 0

const winningScore = 7

let isNewGame = true
let isGameOver = true

let speedY = -1
let speedX = speedY
let computerSpeed = 3



//generating canvas
const renderCanvas = () => {
    context.fillStyle = 'black'
    context.fillRect( 0, 0, width, height)

    //paddle
    context.fillStyle = 'white'
    context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight)

    context.fillRect(paddleTopx, 10, paddleWidth, paddleHeight)


    //middle line
    context.beginPath()
    context.setLineDash([4])
    context.moveTo(0, 350)
    context.lineTo(500,350)
    context.strokeStyle = 'lime'
    context.stroke()

    //ball
    context.beginPath()
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false)
    context.fillStyle = 'white'
    context.fill()  

    //score
    context.font = '32px Courier New'
    context.fillText(playerScore, 20, canvas.height / 2 + 50)
    context.fillText(botScore, 20, canvas.height / 2 - 30)  

}

const createCanvas = () => {
    canvas.width = width
    canvas.height = height
    body.appendChild(canvas)
    renderCanvas()
}

const animate = () => {
    renderCanvas()
    ballMove()
    ballReset()
    ballBoundaries()

}

const startGame = () =>{
    playerScore = 0
    botScore = 0

    createCanvas()
    animate()

}

startGame()

const ballMove = () => {
    // Vertical Speed
    ballY += - speedY

    // Horizontal Speed
    if (playerMoved && paddleContact) {
      ballX += speedX
    }

}

const ballReset = () => {
    ballX = width / 2
    ballY = height / 2
    speedY = -3
    paddleContact = false
}

const ballBoundaries = () => {
    // Bounce off Left Wall
    if (ballX < 0 && speedX < 0) {
      speedX = -speedX
    }
    // Bounce off Right Wall
    if (ballX > width && speedX > 0) {
      speedX = -speedX
    }
    // Bounce off player paddle (bottom)
    if (ballY > height - paddleDiff) {
      if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
        paddleContact = true
        // Add Speed on Hit
        if (playerMoved) {
          speedY -= 1
          // Max Speed
          if (speedY < -5) {
            speedY = -5
            computerSpeed = 6
          }
        }
        speedY = -speedY
        trajectoryX = ballX - (paddleBottomX + paddleDiff)
        speedX = trajectoryX * 0.3
      } else if (ballY > height) {
        // Reset Ball, add to Computer Score
        ballReset()
        botScore++
      }
    }
    // Bounce off computer paddle (top)
    if (ballY < paddleDiff) {
      if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
        // Add Speed on Hit
        if (playerMoved) {
          speedY += 1
          // Max Speed
          if (speedY > 5) {
            speedY = 5
          }
        }
        speedY = -speedY
      } else if (ballY < 0) {
        // Reset Ball, add to Player Score
        ballReset()
        playerScore++
      }
    }
}

const botAI = () => {
    if (playerMoved) {
      if (paddleTopX + paddleDiff < ballX) {
        paddleTopX += computerSpeed
      } else {
        paddleTopX -= computerSpeed
      }
    }
}

const gameOver = () => {
    if(playerScore === winningScore || botScore === winningScore) {
      isGameOver = true
    }
  }

const gameOverDiv = document.createElement('div')

const showGameOverMsg = (winner) => {
    //hide canvas
    canvas.hidden = true
    gameOverDiv.textContent = ''
    const title = document.createElement('h1')
    title.textContent = `${winner} Wins!!!`
    const playAgainBtn = document.createElement('button')
    playAgainBtn.setAttribute('onclick', 'startGame()')
    playAgainBtn.textContent = 'Play Again'
    gameOverDiv.append(title, playAgainBtn)
    body.appendChild(gameOverDiv)
}


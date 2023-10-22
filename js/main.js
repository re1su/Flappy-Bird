const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const restartBtn = document.getElementById('restart')
const easyMode = document.getElementById('easy-mode')
const mediumMode = document.getElementById('medium-mode')
const hardMode = document.getElementById('hard-mode')
const pipe = []
const bird = new Image()
const bg = new Image()
const fg = new Image()
const pipeUp = new Image()
const pipeBottom = new Image()
let gap = 100
let gravitation = 1.7
let score = 0
let hightScore = 0
const audio = new Audio()

let birdXPos = 10
let birdYPos = 150

bird.src = './img/bird.png'
bg.src = './img/flappy_bird_bg.png'
fg.src = './img/flappy_bird_fg.png'
pipeUp.src = './img/pipeUp.png'
pipeBottom.src = './img/pipeBottom.png'

audio.src = '../audio/score.mp3'

pipe[0] = {
  x: canvas.width,
  y: 0
}

easyMode.addEventListener('click', () => {
  gap = 120
})

mediumMode.addEventListener('click', () => {
  gap = 100
})

hardMode.addEventListener('click', () => {
  gap = 75  
})

document.addEventListener('keydown', jump)

function jump() {
  if (event.code === 'Space') {
    birdYPos -= 35
  }
}

restartBtn.addEventListener('click', () => {
  score = 0
  birdXPos = 10
  birdYPos = 150

  pipe.length = 0
  pipe[0] = {
    x: canvas.width,
    y: 0
  }

  document.querySelector('.end-game-container').style.display = 'none'
  document.addEventListener('keydown', jump)
  requestAnimationFrame(loop)
})

function loop() {
  ctx.drawImage(bg, 0, 0)
  ctx.drawImage(fg, 0, canvas.height - fg.height)
  ctx.drawImage(bird, birdXPos, birdYPos)
  
  for (let i = 0; i < pipe.length; i++) {
    // drawing pipes
    ctx.drawImage(pipeUp,  pipe[i].x, pipe[i].y)
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap)

    pipe[i].x -= 1

    // add 1 random pipe every time the `i` pipe reaches 100
    if (pipe[i].x === 100) {
      pipe.push({
        x: canvas.width,
        y: Math.floor((Math.random() * pipeUp.height) - pipeUp.height)
      })
    }

    // checking for bird and pipe collision
    if (bird.width + birdXPos >= pipe[i].x &&
        birdXPos <= pipe[i].x + pipeUp.width &&
        (birdYPos <= pipe[i].y + pipeUp.height
        || bird.height + birdYPos >= pipe[i].y + pipeUp.height + gap)
        || bird.height + birdYPos >= canvas.height
        || birdYPos <= 0) {

      document.removeEventListener('keydown', jump)
      endGame()
      return
    }

    if (pipe[i].x === -20) {
      audio.volume = 0.15
      audio.play()
      score++
    }
  }

  birdYPos += gravitation

  // prevents the infinity of the array
  if (pipe.length === 4) {
    pipe.shift()
  }


  requestAnimationFrame(loop)
}

function endGame() {
  let localStorageHighScore = +localStorage.getItem('highScore')
  isNaN(localStorageHighScore) ? localStorageHighScore = 0 : localStorageHighScore
  score > localStorageHighScore ? localStorageHighScore = score : localStorageHighScore
  localStorage.setItem('highScore', JSON.stringify(localStorageHighScore))

  document.querySelector('.end-game-container').style.display = 'flex'
  document.querySelector('#score').textContent = score
  document.querySelector('#high-score').textContent = localStorage.getItem('highScore')
}

pipeBottom.onload = loop;

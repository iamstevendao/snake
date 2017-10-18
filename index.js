function init () {
  var canvas = document.getElementById('root')
  const ROW_NUMBER = 40
  var ctx = canvas.getContext('2d')
  var w = window.innerWidth
  var h = window.innerHeight
  canvas.height = w > h ? h - 150 : w - 150
  canvas.width = canvas.height
  w = canvas.width
  var direction = 'right'
  var cw = w / ROW_NUMBER
  var food = {}
  var theLast = {}
  var speed = 60
  var isPause = true
  var timer

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, w)

  ctx.fillStyle = '#ffffff'
  var snake = []
  for (let i = 0; i < 5; i++) {
    let position = {}
    position.x = 5 - i
    position.y = 0
    snake.push(position)
    ctx.fillRect(cw * snake[snake.length - 1].x, cw * snake[snake.length - 1].y, cw, cw)
  }
  genarateFood()
  // var timer = setInterval(updateFrame, speed);
  function updateFrame () {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, w, w)
    drawSnake()
    drawFood()
  }

  function drawFood () {
    ctx.fillStyle = '#009900'
    ctx.fillRect(food.x * cw, food.y * cw, cw, cw)
  }
  function newFood (x, y) {
    food = {}
    food.x = x
    food.y = y
    console.log('Food: ' + x + ', ' + y)
  }

  function genarateFood () {
    let x = Math.floor((Math.random() * ROW_NUMBER))
    let y = Math.floor((Math.random() * ROW_NUMBER))
    snake.findIndex(value => value.x === x && value.y === y) > -1 ? genarateFood() : newFood(x, y)
  }
  function drawSnake () {
    ctx.fillStyle = '#ffffff'
    theLast = {}
    theLast.x = snake[snake.length - 1].x
    theLast.y = snake[snake.length - 1].y
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x
      snake[i].y = snake[i - 1].y
    }
    switch (direction) {
      case 'right':
        snake[0].x++
        break
      case 'left':
        snake[0].x--
        break
      case 'up':
        snake[0].y--
        break
      case 'down':
        snake[0].y++
        break
    }

    checkFood()
    checkLose()
    for (let i = snake.length - 1; i >= 0; i--) {
      ctx.fillRect(snake[i].x * cw, snake[i].y * cw, cw, cw)
    }
  }
  function checkSpeed () {
    if (snake.length % 4 === 0) {
      if (speed > 25) { speed -= 5 }
      clearInterval(timer)
      console.log('speed: ' + speed)
      timer = setInterval(updateFrame, speed)
    }
  }
  function checkFood () {
    if (snake[0].x === food.x && snake[0].y === food.y) {
      snake.push(theLast)
      genarateFood()
      checkSpeed()
    }
  }
  function checkLose () {
    if (snake[0].x < 0 ||
      snake[0].x > ROW_NUMBER ||
      snake[0].y < 0 ||
      snake[0].y > ROW_NUMBER) {
      reset()
    }
    for (var i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        reset()
        break
      }
    }
  }

  function reset () {
    console.log('game over')
    clearInterval(timer)
    init()
  }

  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        if (direction !== 'right') { direction = 'left' }
        break
      case 38:
        if (direction !== 'down') { direction = 'up' }
        break
      case 39:
        if (direction !== 'left') { direction = 'right' }
        break
      case 40:
        if (direction !== 'up') { direction = 'down' }
        break
      case 32:
        console.log('space pressed')
        if (!isPause) { clearInterval(timer) } else {
          timer = setInterval(updateFrame, speed)
        }
        isPause = !isPause
        break
    }
  }

  document.addEventListener('touchstart', handleTouchStart, false)
  document.addEventListener('touchmove', handleTouchMove, false)

  var xDown = null
  var yDown = null

  function handleTouchStart (evt) {
    xDown = evt.touches[0].clientX
    yDown = evt.touches[0].clientY
  }

  function handleTouchMove (evt) {
    if (!xDown || !yDown) {
      return
    }

    var xUp = evt.touches[0].clientX
    var yUp = evt.touches[0].clientY

    var xDiff = xDown - xUp
    var yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
      if (xDiff > 0) {
        /* left swipe */
        if (direction !== 'right') { direction = 'left' }
      } else {
        /* right swipe */
        if (direction !== 'left') { direction = 'right' }
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
        if (direction !== 'down') { direction = 'up' }
      } else {
        /* down swipe */
        if (direction !== 'up') { direction = 'down' }
      }
    }
    /* reset values */
    xDown = null
    yDown = null
  }
}

init()

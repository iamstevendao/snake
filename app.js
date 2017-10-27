const SIZE = getSize()
const UNIT = SIZE / 20
const DIRECTION = { LEFT: 'l', RIGHT: 'r', UP: 'u', DOWN: 'd' }

var game = new Phaser.Game(SIZE, SIZE, Phaser.AUTO, 'root', { preload: preload, create: create, update: update })

function preload () {
  game.load.image('snake', 'assets/snake.png')
  game.load.image('food', 'assets/food.png')
  game.load.image('background', 'assets/background.jpg')
}
var snake
var speed = 50
var food
var cursors
function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  // background
  let bg = game.add.sprite(0, 0, 'background')
  bg.width = bg.height = SIZE

  // snake
  snake = game.add.sprite(UNIT, 0, 'snake')
  snake.width = snake.height = UNIT
  game.physics.arcade.enable(snake)

  // food
  food = game.add.sprite(UNIT * 2, 0, 'food')
  food.width = food.height = UNIT

  // arrow keys pressed
  game.input.keyboard.onDownCallback = function (e) {
    handleCursors(e)
  }
}

function update () {

  // key pressed
}

function getSize () {
  let w = window.innerWidth
  let h = window.innerHeight
  return w > h ? h - 150 : w - 150
}

function handleCursors (e) {
  switch (e.keyCode) {
    case 37:
      if (getDirection() !== DIRECTION.RIGHT) { go(DIRECTION.LEFT) }
      break
    case 38:
      if (getDirection() !== DIRECTION.DOWN) { go(DIRECTION.UP) }
      break
    case 39:
      if (getDirection() !== DIRECTION.LEFT) { go(DIRECTION.RIGHT) }
      break
    case 40:
      console.log(getDirection())
      if (getDirection() !== DIRECTION.UP) { go(DIRECTION.DOWN) }
      break
  }
}

function go (direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      snake.body.velocity.y = 0
      snake.body.velocity.x = 0 - speed
      break
    case DIRECTION.RIGHT:
      snake.body.velocity.y = 0
      snake.body.velocity.x = speed
      break
    case DIRECTION.UP:
      snake.body.velocity.y = 0 - speed
      snake.body.velocity.x = 0
      break
    case DIRECTION.DOWN:
      snake.body.velocity.y = speed
      snake.body.velocity.x = 0
      break
  }
}

function getDirection () {
  if (snake.body.velocity.y > 0)
    return DIRECTION.DOWN
  else if (snake.body.velocity.y < 0)
    return DIRECTION.UP
  if (snake.body.velocity.x > 0)
    return DIRECTION.LEFT
  else return DIRECTION.RIGHT
}
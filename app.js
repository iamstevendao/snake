const SIZE = getSize()
const ROW = 20
const UNIT = SIZE / ROW
const DIRECTION = { LEFT: 'l', RIGHT: 'r', UP: 'u', DOWN: 'd' }

var game = new Phaser.Game(SIZE, SIZE, Phaser.AUTO, 'root', { preload: preload, create: create, update: update })

function preload () {
  game.load.image('snake', 'assets/snake.png')
  game.load.image('food', 'assets/food.png')
  game.load.image('background', 'assets/background.jpg')
}
var snake
var speed
var food
var cursors
function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // initialize variables
  initialize()

  // background
  let bg = game.add.sprite(0, 0, 'background')
  bg.width = bg.height = SIZE

  // snake
  snake = game.add.sprite(UNIT, 0, 'snake')
  snake.width = snake.height = UNIT

  game.physics.arcade.enable(snake)
  snake.body.collideWorldBounds = true

  // food
  generateFood()

  // arrow keys pressed
  game.input.keyboard.onDownCallback = function (e) {
    handleCursors(e)
  }
}

function update () {
  game.physics.arcade.overlap(snake, food, eatFood, null, this)
}


function initialize () {
  speed = UNIT * 5
}
function eatFood (snake, food) {
  food.kill()
  generateFood()
}

function generateFood () {
  food = game.add.sprite(random(ROW) * UNIT, random(ROW) * UNIT, 'food')
  game.physics.arcade.enable(food)
  food.width = food.height = UNIT
}

function random (x) {
  return Math.floor(Math.random() * x)
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
  else if (snake.body.velocity.x > 0)
    return DIRECTION.LEFT
  else return DIRECTION.RIGHT
}
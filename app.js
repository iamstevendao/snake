const SIZE = getSize()
const UNIT = 20
const DIRECTION = { LEFT: 'l', RIGHT: 'r', UP: 'u', DOWN: 'd' }

var game = new Phaser.Game(SIZE, SIZE, Phaser.AUTO, 'root', { preload: preload, create: create, update: update })

function preload () {
  game.load.image('snake', 'assets/snake.png')
  game.load.image('food', 'assets/food.png')
  game.load.image('background', 'assets/background.jpg')
}
var snake = []
var snakePath = new Array()
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
  createSnake()

  // points
  createPath()

  // food
  createFood()

  // arrow keys pressed
  game.input.keyboard.onDownCallback = function (e) {
    handleCursors(e)
  }
}

function update () {
  game.physics.arcade.overlap(snake.children[0], food, eatFood, null, this)
  updatePath()
  updateSnake()
  console.log('0: ', snake.children[1].x, ' 1: ', snake.children[0].y)
}

function createPath () {
  for (let i = 0; i <= (snake.children.length - 1) * UNIT; i++) {
    snakePath[i] = new Phaser.Point(0, 0);
  }
}

function updatePath () {
  let path = snakePath.pop();
  path.setTo(snake.children[0].x, snake.children[0].y);
  snakePath.unshift(path);
}

function initialize () {
  speed = UNIT * 5
}

function eatFood (snake, food) {
  food.kill()
  createFood()
}

function createSnake () {
  snake = game.add.group()
  snake.enableBody = true
  game.physics.arcade.enable(snake)

  for (let i = 0; i < 5; i++) {
    let sn = snake.create(0, 0, 'snake')
    sn.width = sn.height = UNIT
  }
  snake.children[0].body.velocity.x = speed
}

function createFood () {
  food = game.add.sprite(random(SIZE - UNIT), random(SIZE - UNIT), 'food')
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
      updateVelocity(0 - speed, 0)
      break
    case DIRECTION.RIGHT:
      updateVelocity(speed, 0)
      break
    case DIRECTION.UP:
      updateVelocity(0, 0 - speed)
      break
    case DIRECTION.DOWN:
      updateVelocity(0, speed)
      break
  }
}

function updateVelocity (vx, vy) {
  snake.children[0].body.velocity.y = vy
  snake.children[0].body.velocity.x = vx
}

function updateSnake () {
  for (let i = 1; i < snake.children.length; i++) {
    snake.children[i].x = snakePath[i * UNIT].x;
    snake.children[i].y = snakePath[i * UNIT].y;
  }
}

function getDirection () {
  if (snake.children[0].body.velocity.y > 0)
    return DIRECTION.DOWN
  else if (snake.children[0].body.velocity.y < 0)
    return DIRECTION.UP
  else if (snake.children[0].body.velocity.x > 0)
    return DIRECTION.LEFT
  else return DIRECTION.RIGHT
}
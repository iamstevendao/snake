const SIZE = getSize()
const UNIT = 20
const DIRECTION = { LEFT: 'l', RIGHT: 'r', UP: 'u', DOWN: 'd' }

var game = new Phaser.Game(SIZE, SIZE, Phaser.AUTO, 'root', { preload: preload, create: create, update: update })

function preload () {
  game.load.image('snake', 'assets/snake.png')
  game.load.image('food', 'assets/food.png')
  game.load.image('background', 'assets/background.jpg')
}
var head
var tail = new Array()
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
  game.physics.arcade.overlap(head, food, eatFood, null, this)
  updatePath()
  updateSnake()
}

function createPath () {
  for (let i = 0; i <= tail.length * UNIT / 2; i++) {
    snakePath[i] = new Phaser.Point(0, 0);
  }
}

function updatePath () {
  let path = snakePath.pop();
  path.setTo(head.x, head.y);
  snakePath.unshift(path);
}

function initialize () {
  speed = UNIT * 5
}

function createSnake () {
  // snake head
  head = game.add.sprite(0, 0, 'snake')
  head.width = head.height = UNIT

  // snake physics
  game.physics.arcade.enable(head)
  head.body.velocity.x = speed
  head.body.collideWorldBounds = true

  // snake tail
  for (let i = 1; i < 5; i++) {
    tail[i] = game.add.sprite(0, 0, 'snake')
    tail[i].width = tail[i].height = UNIT
  }
}

function createFood () {
  food = game.add.sprite(random(SIZE - UNIT), random(SIZE - UNIT), 'food')
  game.physics.arcade.enable(food)
  food.width = food.height = UNIT
}

function eatFood (snake, food) {
  grow()
  food.kill()
  createFood()
}

function grow () {
  growTail()
  growPath()
}

function growTail () {
  let lastOfTail = tail[tail.length - 1]
  let sn = game.add.sprite(lastOfTail.x, lastOfTail.y, 'snake')
  sn.width = sn.height = UNIT
  tail.push(sn)
}

function growPath () {
  for (let i = (tail.length - 1) * UNIT / 2 + 1; i <= tail.length * UNIT / 2; i++) {
    snakePath[i] = new Phaser.Point(lastOfTail.x, lastOfTail.y)
  }
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
  head.body.velocity.y = vy
  head.body.velocity.x = vx
}

function updateSnake () {
  for (let i = 1; i < tail.length; i++) {
    tail[i].x = snakePath[i * UNIT / 2].x;
    tail[i].y = snakePath[i * UNIT / 2].y;
  }
}

function getDirection () {
  if (head.body.velocity.y > 0)
    return DIRECTION.DOWN
  else if (head.body.velocity.y < 0)
    return DIRECTION.UP
  else if (head.body.velocity.x > 0)
    return DIRECTION.LEFT
  else return DIRECTION.RIGHT
}
const SIZE = getSize() // size of game world
const UNIT = SIZE / 20 // size of element
const SPACER = 2 // space between elements of the tail
const SIZE_TAIL = 10 // initial size of tail
const TAIL_ADDING = 3 // number of dots added to tail when grows
const DIRECTION = { LEFT: 2, RIGHT: 0, UP: 1, DOWN: 3 } // direction, order in the sprite sheet

var game = new Phaser.Game(SIZE, SIZE, Phaser.AUTO, 'root', { preload: preload, create: create, update: update })

function preload () {
  game.load.image('snake', 'assets/snake.png')
  game.load.spritesheet('head', 'assets/head.png', 75, 75)
  game.load.image('food', 'assets/firstaid.png')
  game.load.image('poision', 'assets/poision.png')
  game.load.image('background', 'assets/background.jpg')
}

var head
var tail = []
var snakePath = []
var speed
var food
var poisions = []

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // initialize variables
  initialize()

  // background
  let bg = game.add.sprite(0, 0, 'background')
  bg.width = bg.height = SIZE

  // create all elements of the game
  createElements()

  // arrow keys pressed
  game.input.keyboard.onDownCallback = function (e) {
    handleCursors(e)
  }
}

function update () {
  // handle the collision of snake and food and poision
  handlePhysics()
  // update the path were head and tail follow
  updatePath()
  // update the head and tail
  updateSnake()
}

function handlePhysics () {
  collideBounds() // check if snake collide game's bounds
  game.physics.arcade.overlap(head, food, eatFood, null, this) // eat food
  game.physics.arcade.overlap(head, poisions, reset, null, this) // eat poision
}

function collideBounds () {
  if (head.x >= game.world.height ||
    head.x < 0 ||
    head.y < 0 ||
    head.y >= game.world.width) {
    reset()
  }
}
function updateProperties () {
  // increase speed by 10% every after eats 3 food
  if (foodEaten() % 3 === 2) { speed *= 11 / 10 }

  // create a new poision every after eats 6 food
  // until reach the maximum of 6 poision
  if (foodEaten() % 6 === 5 && poisions.length < 6) { createPoision() }
}

function foodEaten () {
  // return number of food eaten so far
  return (tail.length - SIZE_TAIL) / TAIL_ADDING
}

function createPath () {
  for (let i = 0; i <= tail.length * SPACER; i++) {
    snakePath[i] = new Phaser.Point(0, 0)
  }
}

function updatePath () {
  // remove the last one and make a new one at the current pos of the head
  let path = snakePath.pop()
  path.setTo(head.x, head.y)
  snakePath.unshift(path)
}

function initialize () {
  speed = UNIT * 8
}

function createSnake () {
  // snake tail
  for (let i = 1; i < SIZE_TAIL; i++) {
    tail[i] = game.add.sprite(0, 0, 'snake')
    tail[i].width = tail[i].height = UNIT
  }

  // snake head
  head = game.add.sprite(0, 0, 'head')
  head.width = head.height = UNIT

  // snake physics
  game.physics.arcade.enable(head)
  head.body.velocity.x = speed
}

function createFood () {
  food = game.add.sprite(random(SIZE - UNIT), random(SIZE - UNIT), 'food')
  food.width = food.height = UNIT * 1.3
  initializePhysicsProperties(food)
}

function createPoision () {
  // new poision
  let poision = game.add.sprite(random(SIZE - UNIT), random(SIZE - UNIT), 'poision')
  poision.width = poision.height = UNIT * 1.3
  initializePhysicsProperties(poision)

  // push it into the array
  poisions.push(poision)
}

function initializePhysicsProperties (obj) {
  // enable physics
  game.physics.arcade.enable(obj)
  obj.body.bounce.setTo(1, 1)
  obj.body.collideWorldBounds = true
  // random the object's velocity
  obj.body.velocity.x = randomSpeed()
  obj.body.velocity.y = randomSpeed()
}

function randomSpeed () {
  let sign = random(1) < 0.5 ? -1 : 1
  let base = random(0.9) + 0.4
  return base * sign * speed
}

function eatFood (snake, food) {
  // grow
  grow()
  // bring the head to the top again
  game.world.bringToTop(head)
  // kill current food and make a new one
  food.kill()
  createFood()
  // update speed and number of poision
  updateProperties()
}

function grow () {
  growTail()
  growPath()
}

function growTail () {
  let lastOfTail = tail[tail.length - 1]

  // add 3 dots to tail
  for (let i = 0; i < TAIL_ADDING; i++) {
    let sn = game.add.sprite(lastOfTail.x, lastOfTail.y, 'snake')
    sn.width = sn.height = UNIT
    tail.push(sn)
  }
}

function reset () {
  destroyAll()
  createElements()
  initialize()
}

function createElements () {
  createSnake()
  createFood()
  createPoision()
  createPath()
}

function destroyAll () {
  head.destroy()
  tail.forEach((element) => {
    element.destroy()
  })
  tail = []
  food.destroy()
  poisions.forEach((poision) => {
    poision.destroy()
  })
  poisions = []
}

function growPath () {
  let oldLength = tail.length - TAIL_ADDING
  for (let i = oldLength * SPACER + 1; i <= (oldLength + TAIL_ADDING) * SPACER; i++) {
    snakePath[i] = new Phaser.Point(tail[oldLength].x, tail[oldLength].y)
  }
}

function random (x) {
  return Math.floor(Math.random() * x)
}

function getSize () {
  // get the smaller dimension
  let w = window.innerWidth
  let h = window.innerHeight
  return w > h ? h - 150 : w - 150
}

function handleCursors (e) {
  let currentDirection = getDirection()
  switch (e.keyCode) {
    case 37: // left
      if (currentDirection !== DIRECTION.RIGHT) { go(DIRECTION.LEFT) }
      break
    case 38: // up
      if (currentDirection !== DIRECTION.DOWN) { go(DIRECTION.UP) }
      break
    case 39: // right
      if (currentDirection !== DIRECTION.LEFT) { go(DIRECTION.RIGHT) }
      break
    case 40: // down
      if (currentDirection !== DIRECTION.UP) { go(DIRECTION.DOWN) }
      break
  }
}

function go (direction) {
  // set frame
  head.frame = direction

  // update velocity based on the direction
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
    tail[i].x = snakePath[i * SPACER].x
    tail[i].y = snakePath[i * SPACER].y
  }
}

function getDirection () {
  let v = head.body.velocity
  if (v.y > 0) {
    return DIRECTION.DOWN
  }
  if (v.y < 0) {
    return DIRECTION.UP
  }
  if (v.x > 0) {
    return DIRECTION.RIGHT
  }
  if (v.x < 0) {
    return DIRECTION.LEFT
  }
  return -1
}

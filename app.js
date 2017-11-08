const SIZE = getSize() // size of game world
const UNIT = SIZE / 20 // size of element
const SPACER = 3 // space between elements in of the tail
const SIZE_TAIL = 10
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
  game.physics.arcade.overlap(head, food, eatFood, null, this)
  game.physics.arcade.overlap(head, poisions, eatPoision, null, this)

}
function updateProperties () {
  // increase speed by 10% every after eats 3 food
  if (tail.length % 3 === 0)
    speed *= 11 / 10

  // create a new poision every after eats 3 food
  // until reach the maximum of 5 poisions
  if (tail.length % 8 === 0 && poisions.length < 5)
    createPoision()
}

function createPath () {
  for (let i = 0; i <= tail.length * SPACER; i++) {
    snakePath[i] = new Phaser.Point(0, 0)
  }
}

function updatePath () {
  // remove the last one and make a new one as the current pos of the head  
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
  head.body.collideWorldBounds = true
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
  obj.body.bounce.x = obj.body.bounce.y = 1
  obj.body.collideWorldBounds = true
  // random the object's velocity
  obj.body.velocity.x = (random(0.8) + 0.4) * speed
  obj.body.velocity.y = (random(0.8) + 0.4) * speed
}

function eatFood (snake, food) {
  // grow
  grow()
  // bring the head to the top again
  game.world.bringToTop(head)
  // kill current food and make a new one
  food.kill()
  createFood()
  updateProperties()
}

function eatPoision (snake, poisions) {
  reset()
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

function reset () {
  destroyAll()
  createElements();
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
  let oldLength = tail.length - 1
  for (let i = oldLength * SPACER + 1; i <= (oldLength + 1) * SPACER; i++) {
    snakePath[i] = new Phaser.Point(tail[oldLength].x, tail[oldLength].y)
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
  let currentDirection = getDirection()
  switch (e.keyCode) {
    case 37:
      if (currentDirection !== DIRECTION.RIGHT) { go(DIRECTION.LEFT) }
      break
    case 38:
      if (currentDirection !== DIRECTION.DOWN) { go(DIRECTION.UP) }
      break
    case 39:
      if (currentDirection !== DIRECTION.LEFT) { go(DIRECTION.RIGHT) }
      break
    case 40:
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
  if (v.x < 0)
    return DIRECTION.LEFT

  return -1
}

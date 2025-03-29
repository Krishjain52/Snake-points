const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width,
  height = canvas.height;
let fps = 1000 / 12;
let gameLoop;
let gameStarted = false;
const squareSize = 25;
const scoreE1 = document.getElementById("current-score")
const highScoreE1 = document.getElementById("highest-score")
 const gameOverE1 = document.getElementById("score")
 const gameOverscore = document.getElementById("current")
 const playAgainBtn = document.getElementById("play-again")
 let upArrow = document.querySelector(".up");
let leftArrow = document.querySelector(".left");
let rightArrow = document.querySelector(".right");
let downArrow = document.querySelector(".down");
  const easy = document.getElementById("easy")
 const medium = document.getElementById("medium")
 const hard = document.getElementById("hard")
 const element = document.querySelector(".end-screen")


let boardColor = "greenyellow",
  headColor = "black",
  bodyColor = "green";


let currentDirection = "";
let directionsQueue = [];
const directions = {
  RIGHT: "ArrowRight",
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
};

// Draw board
function drawBoard() {
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, width, height);
}

// Draw square
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

  ctx.strokeStyle = boardColor;
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}


let snake = [
  { x: 2, y: 0 }, 
  { x: 1, y: 0 }, 
  { x: 0, y: 0 }, 
];
const initialSnakeLength = snake.length;

function drawSnake() {
  snake.forEach((sq, index) => {
    let color;
    if (index === 0) {
      color = headColor;
    } else {
      color = bodyColor;
    }

    drawSquare(sq.x, sq.y, color);
  });
}

function moveSnake() {
  if (!gameStarted) return;


  const top = { ...snake[0] };



  if (directionsQueue.length) {
    currentDirection = directionsQueue.shift();
  }

  switch (currentDirection) {
    case directions.RIGHT:
      top.x += 1;
      break;
    case directions.LEFT:
      top.x -= 1;
      break;
    case directions.UP:
      top.y -= 1;
      break;
    case directions.DOWN:
      top.y += 1;
      break;
  }

if(foodEaten()){

  food = createFood();
}
else {
  snake.pop();
 
}
snake.unshift(top)
}


function foodEaten() {
  const top = snake[0];
  return food.x === top.x && food.y === top.y;
}

document.addEventListener("keyup", setDirection);
function setDirection(event) {
  const newDirection = event.key;
  const oldDirection = currentDirection;

  if (
    (newDirection === directions.LEFT && oldDirection !== directions.RIGHT) ||
    (newDirection === directions.RIGHT && oldDirection !== directions.LEFT) ||
    (newDirection === directions.UP && oldDirection !== directions.DOWN) ||
    (newDirection === directions.DOWN && oldDirection !== directions.UP)
  ) {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop = setInterval(frame, fps);
    }
    directionsQueue.push(newDirection);
  }
}

const horizontalSq = width / squareSize;
const verticalSq = height / squareSize;


let food = createFood();

function createFood() {
  let food = {
    x: Math.floor(Math.random() * horizontalSq),
    y: Math.floor(Math.random() * verticalSq),
  };

  while (snake.some((square) => square.x === food.x && square.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * horizontalSq),
      y: Math.floor(Math.random() * verticalSq),
    };
  }
  return food;
}



function drawFood() {
  drawSquare(food.x, food.y, "red");
}


let score = 0;
let current = 0;
let highScore = localStorage.getItem("high-score") || 0;
function updateScore(){
  score = snake.length - initialSnakeLength;
  scoreE1.innerHTML = `⭐${score}`;
  highScoreE1.innerHTML = `🏆 ${highScore}`;

  current = score;
  gameOverscore.innerHTML = `⭐${current}`;
}

function hitWall() {
  const top = snake[0];

  return top.x < 0 || top.x >= horizontalSq || top.y < 0 || top.y >= verticalSq;
}


function hitSelf(){
  const snakeBody = [...snake]
  const head = snakeBody.shift()
  return snakeBody.some(
    (square) => square.x === head.x && square.y === head.y
  );
}

function gameOver(){

  highScore = Math.max(score, highScore)
  localStorage.setItem("high-score", highScore)


  scoreE1.innerHTML = ` ⭐${score}`
  highScoreE1.innerHTML =  `🏆 ${highScore}`
  gameOverscore.innerHTML = `⭐${current}`;

  gameOverE1.classList.remove("invisible")
}


function frame() {
  
  drawBoard();
  drawFood();
  moveSnake();
  drawSnake();
  updateScore();
  if (hitWall() || hitSelf()) {
    clearInterval(gameLoop);
    gameOver();
element.classList.remove('invisible')
return;
  }

}
frame();




document.getElementById("up").addEventListener("click", function () {
  setDirection({ key: "ArrowUp" });
});

document.getElementById("left").addEventListener("click", function () {
  setDirection({ key: "ArrowLeft" });
});

document.getElementById("down").addEventListener("click", function () {
  setDirection({ key: "ArrowDown" });
});

document.getElementById("right").addEventListener("click", function () {
  setDirection({ key: "ArrowRight" });
});




easy.addEventListener("click", setEasyDifficulty)

function setEasyDifficulty(){
  fps = 1000 / 8
}

medium.addEventListener("click", setMediumDifficulty)

function setMediumDifficulty(){
  fps = 1000 / 12
}


hard.addEventListener("click", setHardDifficulty)

function setHardDifficulty(){
  fps = 1000 / 20
}






playAgainBtn.addEventListener("click", restartGame);
function restartGame(){
location.reload();

  gameOverE1.classList.add('invisible')

gameStarted = false;


  frame()
}


// In mobile,Use the button
const btns = document.querySelectorAll(".fontIcons i");
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    inputDir = { x: 0, y: 1 }; // Start the game
    console.log(btn.id);
    moveSound.play();
    switch (btn.id) {
      case "ArrowUp":
        inputDir.x = 0;
        inputDir.y = -1;
        break;

      case "ArrowDown":
        inputDir.x = 0;
        inputDir.y = 1;
        break;

      case "ArrowLeft":
        inputDir.x = -1;
        inputDir.y = 0;
        break;

      case "ArrowRight":
        inputDir.x = 1;
        inputDir.y = 0;
        break;
      default:
        break;
    }
  });
});

// Game Constants & Variables
const startGame = document.getElementById("startGame");
const mainContainer = document.querySelector(".body");
const mainContainerChange = mainContainer;
const infoContainer = document.getElementById("intro_Page");
let scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
const congMusic = new Audio("music/Congratulations.mp3");

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 10 }];
food = { x: 25, y: 32 };

// Game Functions:main function: ctime-currentTime in second
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isSnakeCollide(snake) {
  // If Snake bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // If Snake bump into the wall
  if (
    snake[0].x >= 36 ||
    snake[0].x <= 0 ||
    snake[0].y >= 36 ||
    snake[0].y <= 0
  ) {
    return true;
  }

  return false;
}

function isHighScore() {
  hiscore = parseInt(hiscore);
  if (score > hiscore) {
    let name = prompt("Enter Your Name");
    congMusic.play();
    mainContainer.innerHTML = `
        <div 
            style="
            display:flex;
            padding:10px;
            flex-direction:column-reverse;
            gap:10px
        ">
            <button id="restart">Restart Game</button>
            <h1 style="
                color:darkred;
                font-size:40px;
                ">
                Hi,${name}<br>Congralutions<br>You Are the Higher Scorer.
            </h1>
            <img style="width:50vw;height:60vh;margin:0 auto" src="congrats-7.gif">
        </div>
        `;
  } else {
    mainContainer.innerHTML = `
        <div
            style="
            display:flex;
            padding:10px;
            flex-direction:column;
            text-align:center;
            gap:20px
        ">
            <h1 style="
                color:darkred;
                background:linear-gradient(red,white,yellow);
                width:auto;
                border-radius:50%;
                box-shadow:15px 20px 20px rgba(0,0,0,1);
                font-size:48px;">
            Game Over
            </h1>
            <h1 style="
                background-image: url('snake_text_Img.png');
                background-position: center;
                background-repeat: no-repeat;
                background-size:cover;
                color:transparent;
                -webkit-background-clip: text;
                font-size:64px;">
            Refresh & Play Again
            </h1>
            <button id="restart">Restart Game</button>
        </div>`;
  }
  let restartBtn = document.getElementById("restart");
  restartBtn.addEventListener("click", () => {
    window.location.reload();
  });
}
function speedInc(snakeLen) {
  if (snakeLen % 3 === 0) {
    speed += 2;
  }
}
function gameEngine() {
  // 1.update the snake and food
  // (i)When snake is collide iteself ya with wall
  if (isSnakeCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    isHighScore();
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Your Score :" + score;
    speed = 5;
  }

  // When snake will eat the food then we have to increment in score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    speedInc(snakeArr.length);
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "Hi Score :" + hiscoreval;
    }
    scoreBox.innerHTML = "Your Score :" + score;
    foodSound.play();
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 32;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // For Moving the snake:-Replace last snakeArr element by secondLast snakearr element,secondLast snakeArr element by thirdLast snakearr element and so on.....
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // 2. Display the snake and food:-snake is type of array because if snake will eat then 1 food will added with him and food is like an object
  // (i).Display the snake
  const board = document.querySelector(".board");
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  // (ii)Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// 2.Main logic start here.
document.body.addEventListener("click", () => {
  if (mainContainer.style.display) musicSound.play();
});

// For High Score
// First,we will create 'hiscore' variable and put into local storage
let hiscore = localStorage.getItem("hiscore"); //hiscore=0
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "Hi Score :" + hiscoreval;
}
//In gaming,looping is very important.For looping,we can use setInterval() also but here we are using window.requestAnimationFrame(function) because it works more faster.
startGame.addEventListener("click", () => {
  window.requestAnimationFrame(main);
  infoContainer.style.display = "none";
  mainContainer.style.display = "flex";
});

// window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 }; // Start the game
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;

    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    default:
      break;
  }
});

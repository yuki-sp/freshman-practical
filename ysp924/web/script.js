// 获取canvas元素及绘图上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置文字相关属性，用于绘制emoji
ctx.font = "10px Arial";
ctx.textBaseline = "top";

// 蛇的初始位置和大小（以方块为单位，每个方块大小为10px）
const snake = [{ x: 10, y: 10 }];
// 蛇移动的方向，初始向右
let direction = 'right';
// 食物的初始位置
let food = { x: 20, y: 20 };
// 游戏的每一格（方块）大小
const gridSize = 10;
// 当前得分
let score = 0;
// 用于显示得分的元素
const scoreDisplay = document.getElementById('scoreDisplay');
// 用于显示历史最高得分的元素
const highScoreDisplay = document.getElementById('highScoreDisplay');
// 从本地存储中获取历史最高得分，若不存在则设为0
let highScore = localStorage.getItem('highScore')? parseInt(localStorage.getItem('highScore')) : 0;

// 绘制方块的函数（这里方块绘制主要用于食物绘制了）
function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

// 绘制蛇（用emoji表示蛇头，其他部分仍用方块表示）
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    if (i === 0) {
      // 绘制蛇头，用emoji😋表示
      ctx.fillText('😋', segment.x * gridSize, segment.y * gridSize);
    } else {
      drawRect(segment.x, segment.y, 'green');
    }
  }
}

// 绘制食物的函数
function drawFood() {
  drawRect(food.x, food.y,'red');
}

// 移动蛇的函数
function moveSnake() {
  const head = {...snake[0] };
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'w':
      head.y--;
      break;
    case 'a':
      head.x--;
      break;
    case's':
      head.y++;
      break;
    case 'd':
      head.x++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    // 吃到食物，重新生成食物位置，得分加1
    score++;
    updateScoreDisplay();
    generateFood();
  } else {
    snake.pop();
  }
}

// 检测碰撞边界或自身的函数
function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// 生成食物位置的函数，确保食物不在蛇身上
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

// 更新得分显示的函数
function updateScoreDisplay() {
  scoreDisplay.textContent = `得分: ${score}`;
}

// 更新历史最高得分显示的函数
function updateHighScoreDisplay() {
  highScoreDisplay.textContent = `历史最高得分: ${highScore}`;
}

// 游戏主循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
  moveSnake();
  if (checkCollision()) {
    // 游戏结束，比较当前得分和历史最高得分，若当前得分更高则更新历史最高得分
    if (score > highScore) {
      highScore = score;
      updateHighScoreDisplay();
      localStorage.setItem('highScore', highScore);
    }
    alert(`游戏结束！您的最终得分是: ${score}，历史最高得分是: ${highScore}`);
    resetGame();
    return;
  }
  setTimeout(gameLoop, 100);
}

// 获取开始按钮元素
const startButton = document.getElementById('startButton');

// 重置游戏的函数
function resetGame() {
  snake.length = 0;
  snake.push({ x: 10, y: 10 });
  direction = 'right';
  food = { x: 20, y: 20 };
  score = 0;
  updateScoreDisplay();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 在页面加载时初始化历史最高得分显示
window.onload = function () {
  updateHighScoreDisplay();
};

// 为开始按钮添加点击事件监听器，点击后开始游戏循环
startButton.addEventListener('click', function () {
  resetGame();
  gameLoop();
});

// 监听键盘事件改变蛇的方向，同时处理方向键和WASD键
document.addEventListener('keydown', function (e) {
  switch (e.key.toLowerCase()) {
    case 'arrowright':
    case 'd':
      if (direction!== 'left' && direction!== 'a') direction = 'right';
      break;
    case 'arrowleft':
    case 'a':
      if (direction!== 'right' && direction!== 'd') direction = 'left';
      break;
    case 'arrowup':
    case 'w':
      if (direction!== 'down' && direction!== 's') direction = 'up';
      break;
    case 'arrowdown':
    case's':
      if (direction!== 'up' && direction!== 'w') direction = 'down';
      break;
  }
});
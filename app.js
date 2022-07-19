"use strict";



const Line = function (start, length, direction, type = "rect") {
  this.start = start;
  this.width = 0;
  this.height = 0;
  this.length = length;
  this.direction = direction;
  this.color = "";
  this.type = type;
  this.getEndOffset = function (canvasWidth, canvasHeight, cells, direction) {
    let cellWidth = canvasWidth / cells;
    let cellHeight = canvasHeight / cells;
    if (this.direction == "down") {
      let xX = 0;
      if (direction == "right") xX += 1; //offset to start next to this line

      // (height / cellsCount) + (length-1)

      return {
        x: this.start.x + xX,
        y: this.height + this.start.y - 1,
      };
    }

    if (this.direction == "up") {
      let xX = 0;
      if (direction == "right") xX += 1; //offset to start next to this line

      // (height / cellsCount) + (length-1)
      return {
        x: this.start.x + xX,
        y: this.start.y - this.length,
      };
    }

    if (this.direction == "left") {
      let yY = 0;
      if (direction == "down") yY += 1; //offset to start next to this line

      // (height / cellsCount) + (length-1)
      return {
        x: this.start.x - this.length,
        y: this.start.y + yY,
      };
    }

    if (this.direction == "right") {
      let yY = 0;
      if (direction == "down") yY += 1; //offset to start next to this line

      // (height / cellsCount) + (length-1)

      return {
        x: this.width + this.start.x - 1,
        y: this.start.y + yY,
      };
    }

    return {};
  };
  this.getRect = function (canvasWidth, canvasHeight, cells) {
    let xX,
      yY = 0;

    if (this.direction == "up") {
      this.width = 1;
      this.height = -this.length;

      xX = (canvasWidth / cells) * this.start.x;
      yY = (canvasHeight / cells) * this.start.y;
    }
    if (this.direction == "down") {
      this.width = 1;
      this.height = this.length;

      xX = (canvasWidth / cells) * this.start.x;
      yY = (canvasHeight / cells) * this.start.y;
    }
    if (this.direction == "left") {
      this.width = -this.length;
      this.height = 1;

      xX = (canvasWidth / cells) * this.start.x;
      yY = (canvasHeight / cells) * this.start.y;
    }
    if (this.direction == "right") {
      this.height = 1;
      this.width = this.length;

      xX = (canvasWidth / cells) * this.start.x;
      yY = (canvasHeight / cells) * this.start.y;
    }
    return [
      xX,
      yY,
      (canvasWidth / cells) * this.width,
      (canvasHeight / cells) * this.height,
    ];
  };
};

/**
 *
 *  @ SNAKE CLASS
 *
 *
 */
class Snake {
  objType = "snake";
  isDead = false;
  lines = [];
  prevHeadDirection = ""; // direction of last line
  headDirection = "down";
  game;
  color = "rgb(50,50,50)";
  constructor(game) {
    // game.addUpdateListener(this.Update) doesn't work
    this.game = game;
    this.lines = [new Line({ x: 10, y: 5 }, 2, "down")];
    this.calcMovement();
    this.addKeyListener(window);
  }

  calcMovement(x, y) {
    // cloning lines array to new one
    let lastLine = this.lines[this.lines.length - 1];
    let lastLineDirection = lastLine.direction;
    //if the new direction of head is diferent from the last line then split
    if (
      (this.prevHeadDirection != this.headDirection &&
        (lastLineDirection == "down" || lastLineDirection == "up") &&
        !(this.headDirection === "up" || this.headDirection === "down")) ||
      ((lastLineDirection == "right" || lastLineDirection == "left") &&
        !(this.headDirection === "right" || this.headDirection === "left"))
    ) {
      // lines: more than 1

      this.splitSnake(
        [...this.lines],
        this.prevHeadDirection,
        this.headDirection
      );
      this.tailToHead();
      this.prevHeadDirection = this.headDirection;
    } else if (lastLineDirection == this.headDirection) {
      this.tailToHead();
    }
  }
  splitSnake(lines, prevDirection, currentDirection) {
    // if the last line is single and longer than 1 OOORR if multiple lines and last line >=1
    // get last offset
    let offset = lines[lines.length - 1].getEndOffset(
      ...this.game.getResolution(),
      this.game.getCellsCount(),
      currentDirection
    );
    // console.log(offset);
    this.lines.push(new Line(offset, 0, currentDirection));
    this.prevHeadDirection = currentDirection;
  }

  tailToHead() {
    // if lines == 1
    if (this.lines.length == 1) {
      switch (this.headDirection) {
        case "up":
          this.lines[0].start.y--;
          break;
        case "down":
          this.lines[0].start.y++;
          break;
        case "right":
          this.lines[0].start.x += 1;

          break;
        case "left":
          this.lines[0].start.x -= 1;
          break;

        default:
          break;
      }
    } else {
      switch (this.lines[0].direction) {
        case "up":
          this.lines[0].start.y--;
          break;
        case "down":
          this.lines[0].start.y++;
          break;
        case "right":
          this.lines[0].start.x += 1;

          break;
        case "left":
          this.lines[0].start.x -= 1;
          break;

        default:
          break;
      }
      // console.log('Splited');
      this.lines[0].length--;
      this.lines[this.lines.length - 1].length++;

      if (this.lines[0].length === 0) {
        this.lines.shift();
        // console.log('Last line reached 0',this.lines);
      }
    }

    // lines: n>1
  }
  Update() {
    self = this.context;

    if (self.isDead == false) self.calcMovement();
    // console.log('Update called',self);
  }
  addKeyListener(obj) {
    obj.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.prevHeadDirection = this.headDirection;
          this.headDirection = "up";
          break;
        case "ArrowDown":
          this.prevHeadDirection = this.headDirection;
          this.headDirection = "down";
          break;
        case "ArrowLeft":
          this.prevHeadDirection = this.headDirection;
          this.headDirection = "left";
          break;
        case "ArrowRight":
          this.prevHeadDirection = this.headDirection;
          this.headDirection = "right";
          break;
        case "e":
          console.log("feeding");
          this.feed(5);
          break;
        default:
          return;
      }
      // console.log("Arrow pressed: ", this.headDirection);
    });
  }
  onCollision(type, obj = null) {
    switch (type) {
      case "self":
        this.isDead = true;
        this.game.endGame();
        this.game.showMenu();

        break;
      case "enemie":
        this.isDead = true;
        this.game.endGame();
        this.game.showMenu();
        break;
      case "food":
        this.feed(1);
        this.game.deleteObjectToWorld(obj);
        this.game.generateFood()
        break;

      case "border":
        this.isDead = true;
        this.game.endGame();
        break;
    }
  }
  feed(n) {
    console.log("feeding");
    if (this.lines[0].direction === "up") {
      this.lines[0].start.y += n;
      this.lines[0].length += n;
    }
    if (this.lines[0].direction === "down") {
      this.lines[0].start.y -= n;
      this.lines[0].length += n;
    }
    if (this.lines[0].direction === "left") {
      this.lines[0].start.x += n;
      this.lines[0].length += n;
    }
    if (this.lines[0].direction === "right") {
      this.lines[0].start.x -= n;
      this.lines[0].length += n;
    }
  }
}

class Game {
  /*menu vars */
  #gameElement;
  #mainMenu;
  #mainMenuTitle;
  #mainMenuScore;
  #playButton;
  #restartButton;
  #resumeButton;
  #settingsButton;
  #closeButton;

  /*game vars*/
  #canvas ;
  #ctx ;
  #width ;
  #height ;
  #cells ;
  #tickSpeed ;
  #DeltaTime = 1000;

  #score = 0;
  #Snake;
  #objects = [];

  isPaused = false;
  isEnded = false;
  updater; // setInterval
  /*debug*/
  #debug = 0;

  #UpdateListeners = [];
  constructor(gameElementId, width, height,numberOfCells = 20, tickSpeed = 1) {
    this.#gameElement = document.querySelector('#' + gameElementId);
    this.#mainMenu = this.#gameElement.querySelector('.gameMenu');
    this.#mainMenuTitle = this.#mainMenu.querySelector('.title');
    this.#mainMenuScore = this.#mainMenu.querySelector('.score');
    this.#playButton = this.#gameElement.querySelector('#play');
    this.#restartButton = this.#gameElement.querySelector('#restart');
    this.#resumeButton = this.#gameElement.querySelector('#resume');
    this.#settingsButton = this.#gameElement.querySelector('#settings');
    this.#closeButton = this.#gameElement.querySelector('#close');
    this.#canvas = this.#gameElement.querySelector('#' + gameElementId + ' #gameCanvas');
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#ctx = this.#canvas.getContext("2d");
    this.#width = width;
    this.#height = height;
    this.#cells = numberOfCells;
    this.#tickSpeed = tickSpeed;
    
    this.#mainMenu.classList.add('toggle');
    this.#playButton.classList.add('toggle');
    this.#mainMenuTitle.innerHTML = "The Snake game";
    
    this.#playButton.addEventListener('click', ()=> {this.restartGame()});
    this.#restartButton.addEventListener('click', ()=> {this.restartGame()});
    this.#resumeButton.addEventListener('click', ()=> {this.resumeGame()});
    
  }

  getCellsCount() {
    return this.#cells;
  }

  getResolution() {
    return [this.#width, this.#height];
  }

  addObjectToWorld(object, isSnake) {
    this.#objects.push(object);
    if (isSnake) this.#Snake = object;
  }

  deleteObjectToWorld(object) {
    console.log(
      `an ${object.objType}, located at  ${object.lines[0].start.x},${object.lines[0].start.y} has been deleted`
    );
    this.#objects.splice(this.#objects.indexOf(object), 1);
  }

  addUpdateListener(callback, context) {
    let lister = { callback, context };

    this.#UpdateListeners.push(lister);
  }

  render() {
    // render GameObjects Array
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.renderGrid();

    this.#objects.forEach((obj) => {
      obj.lines.forEach((line, i) => {
        this.#ctx.beginPath();

        let newRect = line.getRect(this.#width, this.#height, this.#cells);
        if (line.type == "arc")
          this.#ctx.arc(
            newRect[0] + this.#height / this.#cells / 2,
            newRect[1] + this.#height / this.#cells / 2,
            this.#height / this.#cells / 2,
            0,
            2 * Math.PI
          );
        else 
          this.#ctx.rect(...newRect);
        this.#ctx.fillStyle = obj.color;
        this.#ctx.fill();
        this.#ctx.beginPath();
        if(this.#debug)
        {
          let offsetIndicator = this.#ctx.arc(
            newRect[0],
            newRect[1],
            4,
            0,
            2 * Math.PI
          );
        }
        this.#ctx.fillStyle = "yellow";
        this.#ctx.fill();
      });
    });

    //better than setInterval
    // requestAnimationFrame(this.render.bind(this));
  }

  renderGrid() {
    let GridLayer = this.#canvas.getContext("2d");
    for (let i = 0; i <= this.#cells; i++) {
      GridLayer.beginPath();
      for (let k = 0; k <= this.#cells; k++) {
        // let color = `#${(Math.floor(Math.random() * 4059  )).toString(16)}`;
        let color = (k - i) % 2 == 0 ? "rgb(130,130,130)" : "rgb(200,200,200)";
        GridLayer.fillStyle = color;
        GridLayer.beginPath();
        GridLayer.lineWidth = 1;
        GridLayer.rect(
          (this.#width / this.#cells) * i,
          (this.#height / this.#cells) * k,
          this.#width / this.#cells + this.#width / this.#cells,
          this.#height / this.#cells + this.#width / this.#cells
        );
        GridLayer.fill();
      }
    }
  }

  Update() {
    // render GameObjects Array
    this.updater = setInterval(() => {
      // this.renderGrid();
      this.#UpdateListeners.forEach((listener) => {
        listener.callback(listener.context);
      });
      this.render();
      this.Collision();
    }, this.#DeltaTime * this.#tickSpeed);
  }
  
  restartGame() {
    this.#score = 0;
    this.#objects = [];
    this.isEnded = false;
    let snake = new Snake(this);
    this.addObjectToWorld(snake, true);
    this.addUpdateListener(snake.Update, snake);
    this.generateFood();
    this.Update();
    this.#mainMenu.classList.remove('toggle');
  }
  
  resumeGame() {
    this.isPaused = false;
    clearInterval(this.updater);
    this.#mainMenu.classList.remove('toggle');
  }
  pauseGame() {
    this.isPaused = true;
    clearInterval(this.updater);
    this.#mainMenu.classList.add('toggle');
    this.#mainMenuTitle.innerHTML = "Game Paused!";
    this.#mainMenuScore.innerHTML = `Your Score: ${this.#score}`;
  }
  endGame() {
    this.isEnded = true;
    clearInterval(this.updater);
    this.#mainMenu.classList.add('toggle');
    this.#mainMenuTitle.innerHTML = "You died!";
    this.#mainMenuScore.innerHTML = `Your Score: ${this.#score}`;
  }
  generateFood() {
    let xX = Math.round(Math.random() * (this.#cells -1)) ;
    let yY = Math.round(Math.random() * (this.#cells -1));
    let food = new Food(xX, yY, "red");
    console.log(xX,yY);
    this.addObjectToWorld(food);
  }

  Collision() {
    let snakeLines = this.#Snake.lines;
    // check colisions of snake last line with itself
    for (let i = 0; i < snakeLines.length - 1; i++) {
      let rect1 = {
        direction: snakeLines[snakeLines.length - 1].direction,
        x: snakeLines[snakeLines.length - 1].start.x,
        y: snakeLines[snakeLines.length - 1].start.y,
        width: snakeLines[snakeLines.length - 1].width,
        height: snakeLines[snakeLines.length - 1].height,
      };
      let rect2 = {
        direction: snakeLines[i].direction,
        x: snakeLines[i].start.x,
        y: snakeLines[i].start.y,
        width: snakeLines[i].width,
        height: snakeLines[i].height,
      };
      // fix the negative width and height
      if (rect1.direction == "left") { // left
        rect1.x += rect1.width;
        rect1.width = Math.abs(rect1.width);
      }
      if (rect1.direction == "up") { // up
        rect1.y += rect1.height;
        rect1.height = Math.abs(rect1.height);
      }
      if (rect2.direction == "left") { //left
        rect2.x += rect2.width;
        rect2.width = Math.abs(rect2.width);
      }
      if (rect2.direction == "up") { // up
        rect2.y += rect2.height;
        rect2.height = Math.abs(rect2.height);
      }
      if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      ) {
        // collision with self is detected!
        this.#Snake.onCollision("self");
      }
    }
    //check collision with food
    this.#objects.forEach((obj) => {
      if (obj.objType == "snake") return;
      let rect1 = {
        direction: snakeLines[snakeLines.length - 1].direction,
        x: snakeLines[snakeLines.length - 1].start.x,
        y: snakeLines[snakeLines.length - 1].start.y,
        width: snakeLines[snakeLines.length - 1].width,
        height: snakeLines[snakeLines.length - 1].height,
      };
      if (rect1.direction == "left") {
        rect1.x += rect1.width;
        rect1.width = Math.abs(rect1.width);
      }
      if (rect1.direction == "up") {
        rect1.y += rect1.height;
        rect1.height = Math.abs(rect1.height);
      }
      let rect2 = {
        x: obj.lines[0].start.x,
        y: obj.lines[0].start.y,
        width: obj.lines[0].width,
        height: obj.lines[0].height,
      };

      if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      ) {
        // collision with food is detected!
        this.#Snake.onCollision("food", obj);
      }
    });

    //check collisions with outer bounderies
    let snakeHead = {
      direction: snakeLines[snakeLines.length - 1].direction,
      x: snakeLines[snakeLines.length - 1].start.x,
      y: snakeLines[snakeLines.length - 1].start.y,
      width: snakeLines[snakeLines.length - 1].width,
      height: snakeLines[snakeLines.length - 1].height,
    };
    if (snakeHead.direction == "left") {
      snakeHead.x += snakeHead.width;
      snakeHead.width = Math.abs(snakeHead.width);
    }
    if (snakeHead.direction == "up") {
      snakeHead.y += snakeHead.height;
      snakeHead.height = Math.abs(snakeHead.height);
    }

    if (
      snakeHead.x + snakeHead.width > this.#cells  ||
      snakeHead.x  < 0 ||
      snakeHead.y + snakeHead.height > this.#cells  ||
      snakeHead.y  < 0
    ) {
      // collision with border is detected!
      this.#Snake.onCollision("border");
    }
  }
}

class Food {
  lines;
  color;
  objType = "food";
  score;
  constructor(x, y, color = "red",score = 1) {
    this.lines = [new Line({ x, y }, 1, "down")];
    this.color = color;
    this.score = score;
  }
  randomPlace(x, y, canvasWidth, canvasHeight, cellSize) {}
}
class Obstacle {
  lines;
  color;
  objType = "obstacle";
  constructor(x, y, color = "black") {
    this.lines = [new Line({ x, y }, 1, "down")];
    this.color = color;
  }
  generateLines(x, y, canvasWidth, canvasHeight, length) {}
}

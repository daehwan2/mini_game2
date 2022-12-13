const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let animation_id;

let isLeftPress = false;
let isRightPress = false;

let isStart = false;
let isFinish = false;

let key;

class Monster {
  constructor() {
    this.sort = Math.floor(Math.random() * 2); // 0 or 1

    this.width = 40;
    this.height = 40;

    this.x = canvas.width / 2 - this.width / 2;
    this.y = 0;
  }

  down() {
    this.y += 5;
  }

  draw() {
    ctx.fillStyle = this.sort === 0 ? "green" : "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class PressRange {
  constructor() {
    this.x = 0;
    this.y = 400;
    this.width = canvas.width;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = "lightGray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const pressRange = new PressRange();

class KeyObject {
  constructor(sort) {
    this.x = sort === 0 ? 50 : 700;
    this.y = pressRange.y - 35;

    this.width = 50;
    this.height = 50;

    this.color = sort === 0 ? "green" : "red";
  }

  press() {
    this.x -= 10;
    this.y -= 10;
    this.width = 80;
    this.height = 80;
  }
  draw() {
    ctx.fillStyle = this.color;

    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.font = "italic bold 30px Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(
      `${this.color === "green" ? "A" : "D"}`,
      this.x + 15,
      this.y + 80
    );
  }
}

const leftObject = new KeyObject(0);
const rightObject = new KeyObject(1);

const EndText = {
  x: canvas.width / 2 - 60,
  y: canvas.height / 2,

  draw() {
    ctx.font = "italic bold 40px Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(`게임 끝`, this.x, this.y);
    ctx.font = "italic bold 20px Arial, sans-serif";
    ctx.fillText(`재시작:Enter`, this.x, this.y + 40);
  },
};

const isRange = (monster) => {
  if (monster.y + monster.height > pressRange.y) {
    if (key === "KeyA") {
      leftObject.isClicked = true;
      if (monster.sort === 0) {
        monster.y = 1000;
      } else {
        // 게임 끝
        isFinish = true;
        cancelAnimationFrame(animation_id);
      }
    } else if (key === "KeyD") {
      rightObject.isClicked = true;
      if (monster.sort === 1) {
        monster.y = 1000;
      } else {
        // 게임 끝
        isFinish = true;
        cancelAnimationFrame(animation_id);
      }
    }
  }
};

const isMiss = (monster) => {
  if (monster.y > pressRange.y + pressRange.height) {
    isFinish = true;
    cancelAnimationFrame(animation_id);
  }
};

let timer = 0;
let monsters = [];

const frameExecute = () => {
  animation_id = requestAnimationFrame(frameExecute);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pressRange.draw();
  if (key === "KeyA") {
    leftObject.press();
  } else if (key === "KeyD") {
    rightObject.press();
  }

  if (leftObject.width > 50) {
    leftObject.width -= 5;
    leftObject.height -= 5;
  }
  if (rightObject.width > 50) {
    rightObject.width -= 5;
    rightObject.height -= 5;
  }

  if (leftObject.x < 50) {
    leftObject.x++;
  }
  if (leftObject.y < pressRange.y - 35) {
    leftObject.y++;
  }
  if (rightObject.x < 700) {
    rightObject.x++;
  }
  if (rightObject.y < pressRange.y - 35) {
    rightObject.y++;
  }

  leftObject.draw();
  rightObject.draw();

  if (timer % 20 === 0) {
    const monster = new Monster();
    monsters.push(monster);
  }

  monsters.forEach((monster, index, monsters) => {
    isMiss(monster);
    isRange(monster);

    if (monster.y >= 800) {
      monsters.splice(index, 1);
    }
    monster.down();
    monster.draw();
  });

  key = "";

  if (isFinish) {
    EndText.draw();
  }
};

window.addEventListener("keypress", (e) => {
  console.log(e);
  if (isStart) {
    key = e.code;
  }

  if (isFinish && e.code === "Enter") {
    isStart = true;
    isFinish = false;
    monsters = [];
    timer = 0;

    frameExecute();
  }
});

isStart = true;
frameExecute();

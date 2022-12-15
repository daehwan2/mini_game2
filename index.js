const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const HARD_TRIGGER = 3000;

const KEY_OBJECT_INIT_WIDTH = 80;
const KEY_OBJECT_MAX_WIDTH = 120;
const KEY_OBJECT_INIT_HEIGHT = 80;
const KEY_OBJECT_MAX_HEIGHT = 120;

const LEFT_OBJECT_INIT_X = 50;

const RIGHT_OBJECT_INIT_X = 700;

let animation_id;

let isLeftPress = false;
let isRightPress = false;

let isStart = false;
let isFinish = false;

let key;

const imageList = [
  "manage_01-removebg-preview.png",
  "manage_02-removebg-preview.png",
  "manage_03-removebg-preview.png",
  "manage_04-removebg-preview.png",
  "sup_01-removebg-preview.png",
  "sup_02-removebg-preview.png",
  "sup_03-removebg-preview.png",
  "sup_04-removebg-preview.png",
  "sup_05-removebg-preview.png",
  "mal_01-removebg-preview.png",
  "mal_02-removebg-preview.png",
  "mal_03-removebg-preview.png",
  "mal_04-removebg-preview.png",
  "fab_01-removebg-preview.png",
  "fab_02-removebg-preview.png",
  "fab_03-removebg-preview.png",
  "rum_01-removebg-preview.png",
  "rum_02-removebg-preview.png",
  "rum_03-removebg-preview.png",
  "rum_04-removebg-preview.png",
  "bon_01-removebg-preview.png",
  "bon_02-removebg-preview.png",
  "bon_03-removebg-preview.png",
  "bon_04-removebg-preview.png",
  "bon_05-removebg-preview.png",
  "jam_01-removebg-preview.png",
  "jam_02-removebg-preview.png",
  "jam_03-removebg-preview.png",
  "jam_04-removebg-preview.png",
  "jam_05-removebg-preview.png",
  "jam_06-removebg-preview.png",
  "jam_07-removebg-preview.png",
  "end_01-removebg-preview.png",
  "end_02-removebg-preview.png",
  "end_03-removebg-preview.png",
  "end_04-removebg-preview.png",
  "end_05-removebg-preview.png",
  "end_06-removebg-preview.png",
  "des_01-removebg-preview.png",
  "des_02-removebg-preview.png",
  "des_03-removebg-preview.png",
  "des_04-removebg-preview.png",
  "des_05-removebg-preview.png",
  "mul_01-removebg-preview.png",
  "mul_02-removebg-preview.png",
  "mul_03-removebg-preview.png",
  "mul_04-removebg-preview.png",
  "mul_05-removebg-preview.png",
  "it_01-removebg-preview.png",
  "it_02-removebg-preview.png",
  "it_03-removebg-preview.png",
  "it_04-removebg-preview.png",
];

const Score = {
  x: 600,
  y: 30,

  draw(value) {
    // console.log(value);
    ctx.font = "italic bold 30px Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(`점수: ${value}`, this.x, this.y);
  },
};
class Monster {
  constructor() {
    this.sort = Math.floor(Math.random() * 2); // 0 or 1

    this.width = 70;
    this.height = 70;

    this.x = canvas.width / 2 - this.width / 2;
    this.y = 0;

    this.image = this.sort === 0 ? leftObject.image : rightObject.image;
  }

  down(timer) {
    if (timer > HARD_TRIGGER) {
      this.y += 6;
    } else {
      this.y += 5;
    }
  }

  draw() {
    ctx.fillStyle = this.sort === 0 ? "green" : "red";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class PressRange {
  constructor() {
    this.x = 0;
    this.y = 400;
    this.width = canvas.width;
    this.height = 25;
    const btnImage = new Image();
    btnImage.src = "assets/button.png";
    this.image = btnImage;
  }

  draw() {
    ctx.fillStyle = "gray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

const pressRange = new PressRange();

class KeyObject {
  constructor(sort) {
    this.x = sort === 0 ? LEFT_OBJECT_INIT_X : RIGHT_OBJECT_INIT_X;
    this.y = pressRange.y - 35;

    this.width = KEY_OBJECT_INIT_WIDTH;
    this.height = KEY_OBJECT_INIT_HEIGHT;

    this.color = sort === 0 ? "green" : "red";
    this.image = new Image();
    this.image.src = `assets/${
      imageList[Math.floor(Math.random() * imageList.length)]
    }`;
  }

  press() {
    this.x -= 10;
    this.y -= 10;
    this.width = KEY_OBJECT_MAX_WIDTH;
    this.height = KEY_OBJECT_MAX_HEIGHT;
  }
  draw() {
    ctx.fillStyle = this.color;

    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = "italic bold 30px Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(
      `${this.color === "green" ? "◀︎" : "►"}`,
      this.x + 30,
      this.y + 110
    );
  }
}

let leftObject = new KeyObject(0);
let rightObject = new KeyObject(1);

const EndText = {
  x: canvas.width / 2 - 60,
  y: canvas.height / 2,

  draw() {
    ctx.font = "italic bold 40px Arial, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(`게임 끝`, this.x, this.y);
    ctx.font = "italic bold 20px Arial, sans-serif";
    ctx.fillText(`재시작:Enter`, this.x, this.y + 40);
  },
};

const isRange = (monster) => {
  if (monster.y + monster.height > pressRange.y) {
    if (key === "ArrowLeft") {
      leftObject.isClicked = true;
      if (monster.sort === 0) {
        monster.y = 1000;
      } else {
        // 게임 끝
        isFinish = true;
        setRank({ name: playerName, score: timer, game: "말랑분류" });
        cancelAnimationFrame(animation_id);
      }
    } else if (key === "ArrowRight") {
      rightObject.isClicked = true;
      if (monster.sort === 1) {
        monster.y = 1000;
      } else {
        // 게임 끝
        isFinish = true;
        setRank({ name: playerName, score: timer, game: "말랑분류" });
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
const backgroundImg = new Image();
backgroundImg.src = "assets/bg.png";

const frameExecute = () => {
  animation_id = requestAnimationFrame(frameExecute);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  pressRange.draw();
  if (key === "ArrowLeft") {
    leftObject.press();
  } else if (key === "ArrowRight") {
    rightObject.press();
  }

  if (leftObject.width > KEY_OBJECT_INIT_WIDTH) {
    leftObject.width -= 5;
    leftObject.height -= 5;
  }
  if (rightObject.width > KEY_OBJECT_INIT_WIDTH) {
    rightObject.width -= 5;
    rightObject.height -= 5;
  }

  if (leftObject.x < LEFT_OBJECT_INIT_X) {
    leftObject.x++;
  }
  if (leftObject.y < pressRange.y - 35) {
    leftObject.y++;
  }
  if (rightObject.x < RIGHT_OBJECT_INIT_X) {
    rightObject.x++;
  }
  if (rightObject.y < pressRange.y - 35) {
    rightObject.y++;
  }

  leftObject.draw();
  rightObject.draw();

  const createMonsterTime = timer === HARD_TRIGGER ? 10 : 20;
  if (timer % createMonsterTime === 0) {
    const monster = new Monster();
    monsters.push(monster);
  }

  monsters.forEach((monster, index, monsters) => {
    isMiss(monster);
    isRange(monster);

    if (monster.y >= 800) {
      monsters.splice(index, 1);
    }
    monster.down(timer);
    monster.draw();
  });

  key = "";

  Score.draw(timer);

  if (isFinish) {
    EndText.draw();
  }
};
const startGame = () => {
  isStart = true;
  isFinish = false;
  monsters = [];
  timer = 0;
  leftObject = new KeyObject(0);
  rightObject = new KeyObject(1);
  frameExecute();
};

window.addEventListener("keydown", (e) => {
  console.log(e);
  if (isStart) {
    key = e.code;
  }

  if (isFinish && e.code === "Enter") {
    canvas.classList.remove("visible");
    firstLanding.classList.add("visible");
  }

  if (e.code === "KeyF") {
    document.documentElement.requestFullscreen();
  }

  if (e.code === "KeyO") {
    openResult = !openResult;
    getRank();
  }
});

const startBtn = document.querySelector(".startBtn");
const firstLanding = document.querySelector(".first_landing_container");
const secondLanding = document.querySelector(".second_landing_container");
const selectBtn = document.querySelector(".selectBtn");

const rankingLanding = document.querySelector(".rank_landing_container");
const rankBtn = document.querySelector(".rankBtn");
const homeBtn = document.querySelector(".homeBtn");

rankBtn.addEventListener("click", () => {
  firstLanding.classList.remove("visible");
  rankingLanding.classList.add("visible");

  getRank();
});

homeBtn.addEventListener("click", () => {
  firstLanding.classList.add("visible");
  rankingLanding.classList.remove("visible");
});

startBtn.addEventListener("click", () => {
  firstLanding.classList.remove("visible");
  secondLanding.classList.add("visible");
});

selectBtn.addEventListener("click", () => {
  secondLanding.classList.remove("visible");
  canvas.classList.add("visible");

  startGame();
});

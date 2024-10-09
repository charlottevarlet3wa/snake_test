import Snake from "./classes/Snake.js";
import Food from "./classes/Food.js";
import BackgroundDecoration from "./classes/BackgroundDecoration.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#2d2d2d",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);
let snake, food, decorations;
let cursors;
let speed = 750;
let normalSpeed = 750;
let fastSpeed = 1500;
let lastMoveTime = 0;
let mouseX = 0,
  mouseY = 0;

function preload() {
  // Aucune image à charger
}

function create() {
  this.physics.world.setBounds(0, 0, 1600, 1200);

  // Ajouter les décorations de fond
  decorations = new BackgroundDecoration(this);

  // Créer le serpent
  snake = new Snake(this);

  // Ajouter la nourriture
  food = new Food(this);

  // Créer un curseur pour les contrôles
  cursors = this.input.keyboard.createCursorKeys();

  // Gestion de la touche flèche "haut" pour changer la vitesse
  this.input.keyboard.on("keydown-UP", () => {
    speed = fastSpeed;
  });

  this.input.keyboard.on("keyup-UP", () => {
    speed = normalSpeed;
  });

  // Suivre la souris pour diriger la tête du serpent
  this.input.on("pointermove", (pointer) => {
    mouseX = pointer.x + this.cameras.main.scrollX;
    mouseY = pointer.y + this.cameras.main.scrollY;
  });

  this.cameras.main.setBounds(0, 0, 1200, 800);
  this.cameras.main.startFollow(snake.head);
}

function update(time) {
  if (time > lastMoveTime + 100) {
    snake.moveSnake(speed);
    lastMoveTime = time;
  }

  snake.rotateHead(mouseX, mouseY);

  // Vérifier la collision avec la nourriture
  if (this.physics.overlap(snake.head, food.sprite)) {
    snake.eatFood(food);
    food.spawnNewFood();
  }
}

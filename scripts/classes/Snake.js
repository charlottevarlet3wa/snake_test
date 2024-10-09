import { createCircleWithBorderTexture } from "../utils.js";

export default class Snake {
  constructor(scene) {
    this.scene = scene;
    this.snake = scene.add.group();
    this.createSnakeHead();
    this.createSnakeBody();
  }

  createSnakeHead() {
    createCircleWithBorderTexture(
      this.scene,
      "snakeSegment",
      40,
      0xff0000,
      2,
      0xffffff
    );
    this.head = this.scene.physics.add
      .sprite(400, 300, "snakeSegment")
      .setOrigin(0.5, 0.5);
    this.head.setCircle(20);
    this.head.body.setCollideWorldBounds(true);
    this.snake.add(this.head);
  }

  createSnakeBody() {
    for (let i = 1; i <= 0; i++) {
      let segment = this.scene.physics.add
        .sprite(400 - i * 40, 300, "snakeSegment")
        .setOrigin(0.5, 0.5);
      segment.setCircle(20);
      this.snake.add(segment);
    }
  }

  moveSnake(speed) {
    let segments = this.snake.getChildren();
    let head = segments[0];
    let radianAngle = head.rotation;
    let deltaX = Math.cos(radianAngle) * speed * 0.01;
    let deltaY = Math.sin(radianAngle) * speed * 0.01;
    let prevX = head.x;
    let prevY = head.y;
    head.x += deltaX;
    head.y += deltaY;
    for (let i = 1; i < segments.length; i++) {
      let segment = segments[i];
      let tempX = segment.x;
      let tempY = segment.y;
      segment.x = prevX;
      segment.y = prevY;
      prevX = tempX;
      prevY = tempY;
    }
  }

  rotateHead(mouseX, mouseY) {
    let head = this.snake.getChildren()[0];
    let angle = Phaser.Math.Angle.Between(head.x, head.y, mouseX, mouseY);
    head.rotation = angle;
  }

  eatFood(food) {
    let lastSegment =
      this.snake.getChildren()[this.snake.getChildren().length - 1];
    const uniqueTextureKey = `segment_${this.snake.getChildren().length}`;

    // Utiliser la couleur et la bordure de la nourriture mangée pour le nouveau segment
    createCircleWithBorderTexture(
      this.scene,
      uniqueTextureKey,
      40,
      food.currentStyle.backgroundColor,
      food.currentStyle.borderWidth,
      food.currentStyle.borderColor
    );

    let newSegment = this.scene.physics.add
      .sprite(lastSegment.x, lastSegment.y, uniqueTextureKey)
      .setOrigin(0.5, 0.5);
    newSegment.setCircle(20);
    this.snake.add(newSegment);
  }
}

export default class BackgroundDecoration {
  constructor(scene) {
    this.scene = scene;
    this.createDecorations();
  }

  createDecorations() {
    let graphics = this.scene.add.graphics({ fillStyle: { color: 0x00ff00 } });

    // Rectangle vert
    graphics.fillRect(100, 100, 200, 150);

    // Rectangle rouge
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(1300, 900, 200, 150);

    // Rectangle bleu
    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(800, 500, 200, 200);

    // Rectangle jaune
    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(300, 900, 250, 100);
  }
}

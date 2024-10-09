import { createStyledTexture } from "../utils.js";

export default class Food {
  constructor(scene) {
    this.scene = scene;
    this.spawnNewFood();
  }

  spawnNewFood() {
    console.log("spawn new food");
    if (this.sprite) {
      this.sprite.destroy();
    }

    // Générer des propriétés CSS aléatoires pour la nouvelle nourriture
    const randomWidth = Phaser.Math.Between(20, 80);
    const randomHeight = Phaser.Math.Between(20, 80);
    const randomBackgroundColor = Phaser.Display.Color.RandomRGB().color;
    const randomBorderWidth = Phaser.Math.Between(0, 20);
    const randomBorderColor = Phaser.Display.Color.RandomRGB().color;

    // Générer une clé unique pour la texture
    const uniqueTexture = `foodTexture_${Phaser.Math.Between(0, 100000)}`;

    // Créer une texture pour la nourriture avec ces propriétés
    createStyledTexture(this.scene, uniqueTexture, randomWidth, randomHeight, {
      backgroundColor: randomBackgroundColor,
      borderWidth: randomBorderWidth,
      borderColor: randomBorderColor,
    });

    // Ajouter la nourriture au jeu
    this.sprite = this.scene.physics.add.sprite(
      Phaser.Math.Between(50, 1150),
      Phaser.Math.Between(50, 750),
      uniqueTexture
    );
    this.sprite.setImmovable(true);

    // Stocker les propriétés pour les segments du serpent
    this.currentStyle = {
      backgroundColor: randomBackgroundColor,
      borderWidth: randomBorderWidth,
      borderColor: randomBorderColor,
    };
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d2d2d",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);
let snake;
let food;
let cursors;
let speed = 750; // Vitesse initiale du serpent
let normalSpeed = 750; // Vitesse normale du serpent
let fastSpeed = 1500; // Vitesse rapide lorsque ArrowUp est appuyée
let turnSpeed = 3; // Vitesse de rotation
let lastMoveTime = 0;
let sceneContext;
let cameraSpeed = 5; // Vitesse de déplacement de la caméra
let mouseX = 0; // Position X de la souris
let mouseY = 0; // Position Y de la souris

function preload() {
  // Aucune image à charger, les textures seront créées dynamiquement
}

function create() {
  sceneContext = this; // Assigner le contexte de la scène à une variable globale

  // Définir les limites du monde
  this.physics.world.setBounds(0, 0, 1600, 1200); // Taille du monde

  // Ajouter des éléments de décor (rectangles colorés) dans le monde
  let graphics = this.add.graphics({ fillStyle: { color: 0x00ff00 } });
  graphics.fillRect(100, 100, 200, 150); // Rectangle vert
  graphics.fillStyle(0xff0000, 1);
  graphics.fillRect(1300, 900, 200, 150); // Rectangle rouge
  graphics.fillStyle(0x0000ff, 1);
  graphics.fillRect(800, 500, 200, 200); // Rectangle bleu
  graphics.fillStyle(0xffff00, 1);
  graphics.fillRect(300, 900, 250, 100); // Rectangle jaune

  // Créer un groupe pour le serpent
  snake = this.add.group();

  // Ajouter la tête du serpent en utilisant un sprite avec une texture dynamique
  createCircleTexture(this, "snakeSegment", 20, 0xff0000); // Créer une texture de 20px rouge
  let head = this.physics.add
    .sprite(400, 300, "snakeSegment")
    .setOrigin(0.5, 0.5);
  head.setCircle(10); // Définit la zone de collision en cercle
  head.body.setCollideWorldBounds(true); // Empêcher le serpent de sortir du monde
  snake.add(head);

  // Ajouter 10 anneaux derrière la tête
  for (let i = 1; i <= 10; i++) {
    let ring = this.physics.add
      .sprite(400 - i * 20, 300, "snakeSegment")
      .setOrigin(0.5, 0.5);
    ring.setCircle(10); // Zone de collision
    snake.add(ring); // Ajouter chaque anneau au groupe "snake"
  }

  // Créer un curseur pour les contrôles
  cursors = this.input.keyboard.createCursorKeys();

  // Ajouter la nourriture pour la première fois
  addFood();

  // Gestion de la touche flèche "haut" pour changer la vitesse
  this.input.keyboard.on("keydown-UP", () => {
    speed = fastSpeed; // Changer la vitesse à rapide lorsque "ArrowUp" est appuyée
  });

  this.input.keyboard.on("keyup-UP", () => {
    speed = normalSpeed; // Remettre la vitesse à normale lorsque "ArrowUp" est relâchée
  });

  // Configurer la caméra pour bouger
  this.cameras.main.setBounds(0, 0, 1600, 1200); // Définir les limites du monde pour la caméra
  this.cameras.main.startFollow(head); // La caméra suit la tête du serpent

  // Assigner les touches pour déplacer la caméra
  this.input.keyboard.addKeys({
    zoomIn: Phaser.Input.Keyboard.KeyCodes.Z,
    zoomOut: Phaser.Input.Keyboard.KeyCodes.S,
    moveLeft: Phaser.Input.Keyboard.KeyCodes.Q,
    moveRight: Phaser.Input.Keyboard.KeyCodes.D,
    moveUp: Phaser.Input.Keyboard.KeyCodes.A,
    moveDown: Phaser.Input.Keyboard.KeyCodes.W,
  });

  // Écouter les événements de déplacement de la souris
  this.input.on("pointermove", (pointer) => {
    mouseX = pointer.x + this.cameras.main.scrollX; // Ajuster en fonction du décalage de la caméra
    mouseY = pointer.y + this.cameras.main.scrollY;
  });
}

function update(time) {
  let head = snake.getChildren()[0]; // Récupérer la tête du serpent

  // Si un certain temps s'est écoulé, déplacer le serpent
  if (time > lastMoveTime + 100) {
    moveSnake();
    lastMoveTime = time;
  }

  // Calculer l'angle entre la tête et la position de la souris
  let angle = Phaser.Math.Angle.Between(head.x, head.y, mouseX, mouseY);
  head.rotation = angle; // Faire tourner la tête vers la souris

  // Vérifier la collision avec la nourriture
  if (this.physics.overlap(head, food)) {
    eatFood();
  }

  // Gérer les contrôles de la caméra
  let camera = this.cameras.main;

  if (this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.Q].isDown) {
    camera.scrollX -= cameraSpeed; // Déplacement vers la gauche
  }
  if (this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.D].isDown) {
    camera.scrollX += cameraSpeed; // Déplacement vers la droite
  }
  if (this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.A].isDown) {
    camera.scrollY -= cameraSpeed; // Déplacement vers le haut
  }
  if (this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.W].isDown) {
    camera.scrollY += cameraSpeed; // Déplacement vers le bas
  }
}

function moveSnake() {
  let segments = snake.getChildren();
  let head = segments[0];

  // Calculer la nouvelle direction du serpent basée sur son angle
  let radianAngle = head.rotation; // Utiliser l'angle de rotation de la tête
  let deltaX = Math.cos(radianAngle) * speed * 0.01;
  let deltaY = Math.sin(radianAngle) * speed * 0.01;

  // Déplacer la tête
  let prevX = head.x;
  let prevY = head.y;
  head.x += deltaX;
  head.y += deltaY;

  // Déplacer chaque segment en suivant le segment précédent
  for (let i = 1; i < segments.length; i++) {
    let segment = segments[i];
    let tempX = segment.x;
    let tempY = segment.y;

    // Déplacer le segment vers l'emplacement du segment précédent
    segment.x = prevX;
    segment.y = prevY;

    // Stocker les anciennes positions pour le prochain segment
    prevX = tempX;
    prevY = tempY;
  }
}

function addFood() {
  // Supprimer la nourriture actuelle si elle existe
  if (food) {
    food.destroy(); // Détruire l'ancien sprite de nourriture
  }

  // Créer une texture pour la nourriture
  createCircleTexture(sceneContext, "foodTexture", 20, 0x8b4513); // Texture marron pour la nourriture
  food = sceneContext.physics.add.sprite(
    Phaser.Math.Between(50, 1550),
    Phaser.Math.Between(50, 1150),
    "foodTexture"
  );
  food.setCircle(10); // Zone de collision en cercle
  food.setImmovable(true); // La nourriture ne bouge pas
}

function eatFood() {
  // Ajouter un nouveau segment au serpent à la position du dernier segment
  let lastSegment = snake.getChildren()[snake.getChildren().length - 1];
  let newSegment = sceneContext.physics.add
    .sprite(lastSegment.x, lastSegment.y, "snakeSegment")
    .setOrigin(0.5, 0.5);
  newSegment.setCircle(10); // Ajuster la zone de collision pour le nouveau segment
  snake.add(newSegment); // Ajouter le nouveau segment au serpent

  // Réapparaître une nouvelle nourriture
  addFood();
}

// Fonction pour créer une texture de cercle dynamique
function createCircleTexture(scene, key, size, color) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  graphics.fillStyle(color, 1);
  graphics.fillCircle(size / 2, size / 2, size / 2); // Dessiner le cercle
  graphics.generateTexture(key, size, size); // Générer la texture
  graphics.destroy(); // Nettoyer le graphique temporaire
}

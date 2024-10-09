export function createStyledTexture(scene, key, width, height, style) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });

  graphics.fillStyle(style.backgroundColor, 1);
  // graphics.fillStyle("red", 1);
  graphics.fillRect(0, 0, width, height);

  // if (style.borderWidth > 0) {
  // graphics.lineStyle(style.borderWidth, style.borderColor, 1);
  graphics.lineStyle(style.borderWidth, style.borderColor, 1);
  // graphics.strokeRoundedRect(0, 0, width, height, style.borderRadius);
  graphics.strokeRect(0, 0, width, height);
  // }

  graphics.generateTexture(key, width, height);
  graphics.destroy();
}

export function createCircleWithBorderTexture(
  scene,
  key,
  size,
  fillColor,
  borderWidth,
  borderColor
) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });

  graphics.fillStyle(fillColor, 1);
  graphics.fillCircle(size / 2, size / 2, size / 2);

  // if (borderWidth > 0) {
  //   graphics.lineStyle(2, borderColor, 1);
  //   // graphics.lineStyle(borderWidth, borderColor, 1);
  //   graphics.strokeCircle(size / 2, size / 2, size / 2);
  // }

  graphics.generateTexture(key, size, size);
  graphics.destroy();
}
